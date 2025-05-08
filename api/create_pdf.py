from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json
import os
import sys
import pandas as pd
from datetime import datetime
from io import BytesIO
from PIL import Image
from PyPDF2 import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import psycopg2
import requests

# --- Global Settings --- #
TEST_MODE = False # Tkinter GUI and local file opening will be disabled

# For testing: opens the output PDF using the OS default (Disabled in serverless)
# def open_pdf_if_testing(path: str): ... (Keep or remove, won't be called if TEST_MODE is False)

# Ensures new file name if output file already exists (May not be needed if uploading to blob directly)
# def get_unique_filename(base_path, ext=".pdf"): ...

# Safely split CSV fields into list, filtering out "nan" (Adapt if data comes from DB differently)
def safe_split(value):
    if pd.isna(value) or value is None: # Adjusted for potential None from DB
        return []
    return [v.strip() for v in str(value).split(',') if v.strip().lower() != "nan"]

# Scale image proportionally to a given height
def scale_image(image_path, target_height):
    # Ensure image_path is resolvable in serverless context
    # If images are in ./images relative to script, it might work.
    # Consider using absolute paths or fetching images from a URL if they are not deployed with the function.
    try:
        with Image.open(image_path) as img:
            width, height = img.size
            ratio = target_height / height
            return int(width * ratio), int(height * ratio)
    except FileNotFoundError:
        print(f"⚠️ Image not found: {image_path}. Using placeholder dimensions.")
        return int(target_height * (16/9)), target_height # Default to 16:9 aspect ratio or similar
    except Exception as e:
        print(f"⚠️ Error scaling image {image_path}: {e}. Using placeholder dimensions.")
        return int(target_height * (16/9)), target_height

# Try multiple formats to parse a date
def parse_date(date_str):
    if not date_str: return ""
    formats = ["%B %d, %Y", "%d %B %Y", "%b %d, %Y", "%d %b %Y", "%Y-%m-%d", "%Y-%m-%dT%H:%M:%S.%fZ", "%Y-%m-%d %H:%M:%S"]
    for fmt in formats:
        try:
            # Handle potential timezone info if present from DB (e.g. Z for UTC)
            if isinstance(date_str, datetime):
                return date_str.strftime("%d.%m.%Y")
            if 'Z' in date_str:
                 date_str = date_str.replace('Z', '') # Simplistic UTC handling
            dt_obj = datetime.strptime(date_str, fmt.split('.')[0]) # Handle potential fractional seconds
            return dt_obj.strftime("%d.%m.%Y")
        except ValueError:
            continue
    print(f"⚠️ Invalid date format, returning as is: {date_str}")
    return str(date_str) # Fallback to original string if all formats fail

# Draw overlay (text or image) onto one PDF page
def create_overlay(fields, width=A4[0], height=A4[1]):
    buf = BytesIO()
    c = canvas.Canvas(buf, pagesize=(width, height))
    # Assume fonts are registered or standard if not using custom ones that need to be deployed
    # pdfmetrics.registerFont(TTFont('Montserrat', 'Montserrat-Regular.ttf'))
    # pdfmetrics.registerFont(TTFont('Montserrat-Bold', 'Montserrat-Bold.ttf'))
    c.setFillColorRGB(0, 0, 0)

    for field in fields:
        if len(field) > 7 and field[7] == "image":
            try:
                # Ensure image paths (field[0]) are accessible in serverless
                c.drawImage(field[0], field[1], field[2], width=field[8], height=field[9], mask='auto')
            except Exception as e:
                print(f"⚠️ Error loading image '{field[0]}' for overlay: {e}")
            continue

        text, x, y, align, size, weight, max_width = field[:7]
        font = "Montserrat-Bold" if weight == "bold" else "Montserrat"
        text = str(text if text is not None else "") # Handle None from DB

        while size > 4 and max_width and c.stringWidth(text, font, size) > max_width:
            size -= 0.5

        c.setFont(font, size)
        if align == "center":
            x -= c.stringWidth(text, font, size) / 2

        c.drawString(x, y, text)

    c.save()
    buf.seek(0)
    return PdfReader(buf)

# GUI zur Vorschau & Rotation (Will not be used in serverless)
# def preview_and_rotate_images_gui(image_paths): ...

# --- Database Fetch Function --- #
def fetch_heizungsplakette_data(item_id):
    conn_string = os.environ.get("DATABASE_URL")
    if not conn_string:
        raise ConnectionError("DATABASE_URL environment variable not set.")
    
    conn = None
    try:
        conn = psycopg2.connect(conn_string)
        cur = conn.cursor()
        # IMPORTANT: Ensure your table and column names are correct. Especially the primary key column for `id`.
        # Assuming primary key is an integer type for `id`.
        cur.execute('SELECT * FROM "Heizungsplakette" WHERE id = %s', (int(item_id),))
        row = cur.fetchone()
        if row:
            # Convert row (tuple) to a dictionary
            colnames = [desc[0] for desc in cur.description]
            return dict(zip(colnames, row))
        else:
            return None
    except (Exception, psycopg2.Error) as error:
        print(f"Error while connecting to PostgreSQL or fetching data: {error}")
        raise
    finally:
        if conn:
            cur.close()
            conn.close()

# --- Vercel Blob Upload Function --- #
def upload_to_vercel_blob(pdf_bytes, filename):
    blob_rw_token = os.environ.get("BLOB_READ_WRITE_TOKEN")
    if not blob_rw_token:
        raise ValueError("BLOB_READ_WRITE_TOKEN environment variable not set.")

    # Extract store ID: format is vercel_blob_rw_STOREID_SUFFIX
    try:
        parts = blob_rw_token.split('_')
        if len(parts) < 4 or parts[0] != 'vercel' or parts[1] != 'blob' or parts[2] != 'rw':
            raise ValueError("Invalid BLOB_READ_WRITE_TOKEN format.")
        store_id = parts[3]
    except Exception as e:
        raise ValueError(f"Could not parse BLOB_READ_WRITE_TOKEN: {e}")

    # Construct the upload URL
    # The pathname should be URL-encoded if it contains special characters
    upload_url = f"https://{store_id}.blob.vercel-storage.com/{filename}"

    headers = {
        "Authorization": f"Bearer {blob_rw_token}",
        "x-api-version": "6", # As of late 2023/early 2024, check Vercel docs for current version
        "x-content-type": "application/pdf", # More specific than Vercel's example for txt
        # "x-add-random-suffix": "1" # Optional: if you want Vercel to add a random suffix to avoid overwrites
    }

    try:
        response = requests.put(upload_url, data=pdf_bytes, headers=headers)
        response.raise_for_status() # Raises an HTTPError for bad responses (4XX or 5XX)
        blob_data = response.json()
        return blob_data.get("url")
    except requests.exceptions.RequestException as e:
        print(f"Error uploading to Vercel Blob: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Blob API Response: {e.response.text}")
        raise

# --- PDF-Generierung (Adapted) --- #
def generate_pdf_in_memory(row_data, template_path="HeizungsplaketteFinal.pdf"):
    # Ensure template_path is resolvable in serverless function
    # If HeizungsplaketteFinal.pdf is in the same directory or a known path.
    try:
        template_reader = PdfReader(template_path)
    except FileNotFoundError:
        print(f"⚠️ PDF Template not found: {template_path}")
        raise
        
    writer = PdfWriter()
    
    # Adapt data access from `row['column_name']` to `row_data.get('column_name')` for safety
    # Provide default values if a key might be missing and is not critical
    name = f"{row_data.get('vorname', '')} {row_data.get('nachname', '')}"

    energy_date = parse_date(row_data.get('energieausweisDate')) if row_data.get('energieausweis') == 'Ja' else ""
    efh = 'Ja' if row_data.get('artDerImmobilie') == 'Einfamilienhaus' else 'Nein'
    central = 'Ja' if row_data.get('heizsystem') == 'Zentralheizung' else 'Nein'

    img_sources = []
    def add_imgs(key_name, label):
        # Assuming image paths are relative to an 'images' folder accessible by the function
        for p in safe_split(row_data.get(key_name)):
            path = f"images/{p}" # This path needs to be valid in the serverless env.
            # We won't check os.path.exists here in serverless for every image, scale_image will handle it.
            img_sources.append((path, label))

    # Ensure these keys match your DB column names for image lists
    add_imgs("heizungsanlageFotos", "Foto zur Heizungsanlage")
    add_imgs("heizungsetiketteFotos", "Foto zum Typenschild")
    add_imgs("heizungslabelFotos", "Foto zum Heizungslabel")
    add_imgs("bedienungsanleitungFotos", "Foto zur Bedienungsanleitung")

    # Image rotation GUI is skipped due to TEST_MODE = False
    # if TEST_MODE: ...

    img_groups = [img_sources[i:i+2] for i in range(0, len(img_sources), 2)]

    photo_note = (
        "Es wurden keine Fotos bereitgestellt." if not img_sources else
        "Es wurde ein Foto bereitgestellt, welches auf Seite 3 abgebildet ist." if len(img_sources) == 1 else
        "Es wurden Fotos bereitgestellt, welche ab Seite 3 abgebildet sind."
    )
    
    # --- Fields dictionary mapping. Ensure keys match your database column names --- #
    # Use .get() with defaults for safety, e.g., row_data.get('strasse', '')
    fields = {
        0: [
            (f"{row_data.get('strasse', '')} {row_data.get('hausnummer', '')},", 298, 494, 'center', 20, "bold", 210),
            (f"{row_data.get('postleitzahl', '')} {row_data.get('ort', '')}", 298, 474, 'center', 20, "bold", 210),
            (row_data.get('heizungsart', ''), 300, 595, 'center', 20, 'bold', None),
            (row_data.get('heizungshersteller', ''), 225, 422, 'left', 13, 'bold', 90),
            (row_data.get('heizungstechnik', ''), 160, 392, 'left', 13, 'bold', 150),
            (row_data.get('energietraeger', ''), 173, 362, 'left', 13, 'bold', None),
            (energy_date, 184, 331, 'left', 13, 'bold', None),
            (name, 229, 300, 'left', 13, 'bold', 250),
            (row_data.get('baujahr', ''), 456, 422, 'left', 13, 'bold', None),
            (efh, 356, 392, 'left', 13, 'bold', None),
            (central, 419, 362, 'left', 13, 'bold', None),
            (row_data.get('typenbezeichnung', ''), 443, 331, 'left', 13, 'bold', 100),
            ('2044', 345, 254, 'left', 18, 'bold', None), # This seems static
            (photo_note, 43, 170, 'left', 11, 'normal', None),
            (datetime.now().strftime("%d.%m.%Y"), 107, 126, 'center', 11, 'normal', None),
            # Unterschriften images - ensure these paths are correct for serverless deployment
            ('images/Unterschriften/UnterschriftSven.png', 210, 98, '', 0, '', 0, 'image', 56, 72),
            ('images/Unterschriften/UnterschriftCarsten.png', 265, 110, '', 0, '', 0, 'image', 173.8, 36)
        ],
        1: [
            (f"{row_data.get('strasse', '')} {row_data.get('hausnummer', '')}", 297.6, 158, 'center', 20, 'bold', 220),
            (f"{row_data.get('postleitzahl', '')} {row_data.get('ort', '')}", 297.6, 138, 'center', 20, 'bold', 220),
        ]
    }

    for i, group in enumerate(img_groups):
        page_idx = i + 2 # Page index for PDF (0-based), page number for display (1-based)
        if page_idx >= len(template_reader.pages): # Check if template has this many pages
            print(f"⚠️ Template does not have page {page_idx + 1}. Skipping image group.")
            break
        fields[page_idx] = [
            (f"{row_data.get('strasse', '')} {row_data.get('hausnummer', '')}", 297.6, 158, 'center', 20, 'bold', 220),
            (f"{row_data.get('postleitzahl', '')} {row_data.get('ort', '')}", 297.6, 138, 'center', 20, 'bold', 220),
        ]
        y_top = 460
        for j, (path, label) in enumerate(group):
            img_w, img_h = scale_image(path, 180)
            x_pos = A4[0] / 2 - img_w / 2
            y_pos = y_top - j * (img_h + 60) # Ensure this doesn't go off page
            fields[page_idx].append((label, A4[0]/2, y_pos + img_h + 15, 'center', 11, 'bold', 200))
            fields[page_idx].append((path, x_pos, y_pos, '', 0, '', 0, 'image', img_w, img_h))

    # Add pages from template, merging overlay if fields are defined for it
    for i in range(len(template_reader.pages)):
        page = template_reader.pages[i]
        if i in fields:
            overlay = create_overlay(fields[i])
            page.merge_page(overlay.pages[0])
        writer.add_page(page)

    pdf_buffer = BytesIO()
    writer.write(pdf_buffer)
    pdf_buffer.seek(0)
    return pdf_buffer.getvalue()

# Optional: temporäre Bilder löschen (Not relevant for serverless if not writing temp files)
# def cleanup_temp_images(): ...

# --- Serverless Handler --- #
class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        query_params = parse_qs(parsed_path.query)
        
        item_id_str = None
        if 'id' in query_params:
            item_id_str = query_params['id'][0]
            
        if not item_id_str:
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Missing ID parameter"}).encode('utf-8'))
            return

        try:
            item_id = int(item_id_str) # Validate ID is an integer
        except ValueError:
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Invalid ID parameter, must be an integer"}).encode('utf-8'))
            return

        try:
            print(f"Fetching data for ID: {item_id}")
            row_data = fetch_heizungsplakette_data(item_id)

            if not row_data:
                self.send_response(404)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": f"No data found for ID: {item_id}"}).encode('utf-8'))
                return
            
            print(f"Generating PDF for ID: {item_id}")
            # Adjust template path if it's not in the root of the api function directory
            # For Vercel, files in the function directory are accessible.
            # If HeizungsplaketteFinal.pdf is in the same dir as create_pdf.py:
            template_file_path = os.path.join(os.path.dirname(__file__), "HeizungsplaketteFinal.pdf")
            # Ensure image paths like 'images/Unterschriften/UnterschriftSven.png' are relative to where the function runs
            # or are absolute if deployed in a specific structure.
            # A common pattern is to have an 'assets' folder alongside the api function.

            pdf_bytes = generate_pdf_in_memory(row_data, template_path=template_file_path)
            
            # Define a filename for the blob
            # Use .get for safety in case some fields are missing from DB row_data
            safe_nachname = str(row_data.get('nachname', 'N_A')).strip().replace(' ', '_')
            safe_vorname = str(row_data.get('vorname', 'V_A')).strip().replace(' ', '_')
            pdf_filename = f"Heizungsplaketten/Heizungsplakette_{safe_nachname}_{safe_vorname}_{item_id}.pdf"

            print(f"Uploading PDF {pdf_filename} to Vercel Blob for ID: {item_id}")
            blob_url = upload_to_vercel_blob(pdf_bytes, pdf_filename)

            if blob_url:
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"message": "PDF created and uploaded successfully!", "url": blob_url}).encode('utf-8'))
            else:
                raise Exception("Failed to upload PDF to Vercel Blob, no URL returned.")

        except FileNotFoundError as e:
            print(f"ERROR: File not found - {str(e)}")
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": f"Server configuration error: Missing required file - {str(e)}"}).encode('utf-8'))
        except ConnectionError as e:
            print(f"ERROR: Database Connection - {str(e)}")
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": f"Database connection error: {str(e)}"}).encode('utf-8'))
        except ValueError as e: # For BLOB_READ_WRITE_TOKEN parsing or invalid ID
            print(f"ERROR: Value Error - {str(e)}")
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
        except Exception as e:
            print(f"ERROR: General Exception - {str(e)}") # Log the actual error for debugging
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": f"An unexpected error occurred: {str(e)}"}).encode('utf-8'))
        return

# Removed the old if __name__ == "__main__": block as this is now a serverless function handler
