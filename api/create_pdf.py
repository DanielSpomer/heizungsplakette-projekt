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
import argparse
from dotenv import load_dotenv, find_dotenv
import tempfile
import traceback

# --- Global Settings --- #
TEST_MODE = False # Tkinter GUI and local file opening will be disabled

# For testing: opens the output PDF using the OS default (Disabled in serverless)
# def open_pdf_if_testing(path: str): ... (Keep or remove, won't be called if TEST_MODE is False)

# Ensures new file name if output file already exists (May not be needed if uploading to blob directly)
# def get_unique_filename(base_path, ext=".pdf"): ...

# Safely split CSV fields into list, filtering out "nan" (Adapt if data comes from DB differently)
def safe_split(value):
    if value is None:
        return []
    if isinstance(value, list):
        return [str(v).strip() for v in value if str(v).strip().lower() != "nan"]
    if pd.isna(value): 
        return []
    if isinstance(value, str):
        # Try to parse as JSON array first
        try:
            parsed = json.loads(value)
            if isinstance(parsed, list):
                return [str(v).strip() for v in parsed if str(v).strip().lower() != "nan"]
        except json.JSONDecodeError:
            pass
        # If not JSON, try comma splitting
        return [v.strip() for v in value.split(',') if v.strip().lower() != "nan"]
    print(f"⚠️ safe_split received unexpected type for value: {type(value)}, value: {value}")
    return []

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
    c.setFillColorRGB(0, 0, 0)

    for field in fields:
        if len(field) > 7 and field[7] == "image":
            try:
                print(f"DEBUG: Attempting to draw image at position ({field[1]}, {field[2]}) with size {field[8]}x{field[9]}")
                # Get the image data from BytesIO
                image_data = field[0].getvalue()
                # Create a temporary file to store the image
                with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                    temp_file.write(image_data)
                    temp_file.flush()
                    # Draw the image using the temporary file path
                    c.drawImage(temp_file.name, field[1], field[2], width=field[8], height=field[9], mask='auto')
                # Clean up the temporary file
                os.unlink(temp_file.name)
                print("DEBUG: Successfully added image to overlay")
            except Exception as e:
                print(f"⚠️ Error drawing image in overlay: {str(e)}")
                print(f"Traceback:\n{traceback.format_exc()}")
            continue

        # Handle special case for typenbezeichnung field (check if it's at position 443, with y either 331 or 351)
        is_typenbezeichnung = len(field) >= 3 and field[1] == 443 and (field[2] == 331 or field[2] == 351)
        
        text, x, y, align, size, weight, max_width = field[:7]
        font = "Montserrat-Bold" if weight == "bold" else "Montserrat"
        text = str(text if text is not None else "")

        if is_typenbezeichnung and max_width and c.stringWidth(text, font, size) > max_width:
            # Handle line wrapping for typenbezeichnung
            words = text.split()
            lines = []
            current_line = ""
            
            for word in words:
                test_line = current_line + (" " if current_line else "") + word
                if c.stringWidth(test_line, font, size) <= max_width:
                    current_line = test_line
                else:
                    if current_line:
                        lines.append(current_line)
                    current_line = word
            
            if current_line:
                lines.append(current_line)
            
            # Draw each line
            c.setFont(font, size)
            for i, line in enumerate(lines[:2]):  # Limit to 2 lines
                line_y = y - (i * 15)  # 15 pixels line spacing
                if align == "center":
                    line_x = x - c.stringWidth(line, font, size) / 2
                else:
                    line_x = x
                c.drawString(line_x, line_y, line)
        else:
            # Regular text handling
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
def fetch_heizungsplakette_data(item_id: str):
    # Load .env file for local execution if needed
    load_dotenv(find_dotenv())
    conn_string = os.environ.get("DATABASE_URL")
    if not conn_string:
        raise ConnectionError("DATABASE_URL environment variable not set or .env file not found.")
    
    conn = None
    try:
        conn = psycopg2.connect(conn_string)
        cur = conn.cursor()
        # IMPORTANT: Ensure your table and column names are correct. Especially the primary key column for `id`.
        # Assuming primary key is an integer type for `id`.
        cur.execute('SELECT * FROM "Heizungsplakette" WHERE id = %s', (item_id,))
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
# This function will NOT be called by do_GET for PDF generation requests to this endpoint.
# It can be kept if used by other parts of your system or removed if not.
def upload_to_vercel_blob(pdf_bytes, filename):
    # Load .env file for local execution if needed (Blob token might be sensitive)
    # load_dotenv(find_dotenv())
    blob_rw_token = os.environ.get("BLOB_READ_WRITE_TOKEN")
    print(f"DEBUG: Using BLOB_READ_WRITE_TOKEN: {blob_rw_token[:20]}..." if blob_rw_token else "DEBUG: BLOB_READ_WRITE_TOKEN not found!") # Keep debug log
    if not blob_rw_token:
        raise ValueError("BLOB_READ_WRITE_TOKEN environment variable not set.")
    try:
        parts = blob_rw_token.split('_')
        if len(parts) < 4 or parts[0] != 'vercel' or parts[1] != 'blob' or parts[2] != 'rw':
            raise ValueError("Invalid BLOB_READ_WRITE_TOKEN format.")
        store_id_original = parts[3]
        store_id = store_id_original.lower() # Force store ID to lowercase
        print(f"DEBUG: Extracted Store ID (Original): {store_id_original}") 
        print(f"DEBUG: Using Store ID (Lowercase): {store_id}") # Keep debug log
    except Exception as e:
        raise ValueError(f"Could not parse BLOB_READ_WRITE_TOKEN: {e}")
        
    upload_url = f"https://{store_id}.blob.vercel-storage.com/{filename}" # Use lowercase store_id
    headers = {
        "Authorization": f"Bearer {blob_rw_token}",
        "x-api-version": "6",
        "x-content-type": "application/pdf", # Ensure correct content type for PDF
    }
    try:
        print(f"Attempting to upload to: {upload_url}")
        response = requests.put(upload_url, data=pdf_bytes, headers=headers)
        response.raise_for_status()
        blob_data = response.json()
        print(f"Upload successful: {blob_data}")
        return blob_data.get("url")
    except requests.exceptions.RequestException as e:
        print(f"Error uploading to Vercel Blob: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Blob API Response Status: {e.response.status_code}")
            print(f"Blob API Response Body: {e.response.text}")
        raise

# --- PDF-Generierung (Adapted) --- #
def generate_pdf_in_memory(row_data, template_path="template_blanco.pdf"):
    print(f"DEBUG: generate_pdf_in_memory called. Received row_data (first 500 chars): {json.dumps(dict(row_data), default=str)[:500]}")
    script_dir = os.path.dirname(__file__)
    font_base_path = os.path.join(script_dir, "fonts")
    try:
        montserrat_regular_path = os.path.join(font_base_path, "Montserrat-Regular.ttf")
        montserrat_bold_path = os.path.join(font_base_path, "Montserrat-Bold.ttf")
        pdfmetrics.registerFont(TTFont('Montserrat', montserrat_regular_path))
        pdfmetrics.registerFont(TTFont('Montserrat-Bold', montserrat_bold_path))
        print("Successfully registered Montserrat fonts.")
    except Exception as e:
        print(f"⚠️ Error registering fonts: {e}. Falling back to default fonts.")

    # Conditional logic for template and year text
    darf_weiterbetrieben_werden = True
    display_year_text = '2044'
    template_to_use = "template_blanco.pdf"

    try:
        baujahr_str = str(row_data.get('baujahr', '0')).strip()
        if baujahr_str.isdigit():
            baujahr = int(baujahr_str)
            if baujahr > 0: # Basic validation for baujahr
                heizung_alter = datetime.now().year - baujahr
                heizungstechnik = str(row_data.get('heizungstechnik', '')).strip().lower()
                
                # Conditions for "kein Weiterbetrieb"
                if heizung_alter > 30 and heizungstechnik not in ['brennwerttechnik', 'niedertemperaturkessel']:
                    darf_weiterbetrieben_werden = False
                    template_to_use = "template_blanco_kein_weiterbetrieb.pdf"
                    display_year_text = '' # No year text if "kein Weiterbetrieb"
        else:
            print(f"⚠️ Baujahr '{baujahr_str}' is not a valid year string. Defaulting to 'darf_weiterbetrieben_werden = True'.")
    except ValueError as ve:
        print(f"⚠️ Error converting Baujahr to int: {ve}. Defaulting to 'darf_weiterbetrieben_werden = True'.")
    except Exception as e_cond:
        print(f"⚠️ Error in conditional logic for template: {e_cond}. Defaulting to 'darf_weiterbetrieben_werden = True'.")


    full_template_path = os.path.join(script_dir, template_to_use)
    print(f"DEBUG: Using template: {full_template_path}")

    try:
        template_reader = PdfReader(full_template_path)
    except FileNotFoundError:
        print(f"⚠️ PDF Template not found: {full_template_path}")
        raise
        
    writer = PdfWriter()
    name = f"{row_data.get('vorname', '')} {row_data.get('nachname', '')}"
    energy_date = parse_date(row_data.get('energieausweisDate')) if row_data.get('energieausweis') == 'Ja' else "Nicht vorhanden"
    efh = 'Ja' if row_data.get('artDerImmobilie') == 'Einfamilienhaus' else 'Nein'
    central = 'Ja' if row_data.get('heizsystem') == 'Zentralheizung' else 'Nein'

    # Collect all image URLs
    img_sources = []
    def add_imgs(key_name, label):
        print(f"DEBUG: add_imgs for {key_name}, raw value: {row_data.get(key_name)}")
        urls = safe_split(row_data.get(key_name))
        print(f"DEBUG: Parsed URLs for {key_name}: {urls}")
        for url in urls:
            if url and url.startswith('http'):  # Only add valid URLs
                img_sources.append((url, label))

    add_imgs("heizungsanlageFotos", "Foto zur Heizungsanlage")
    add_imgs("heizungsetiketteFotos", "Foto zum Typenschild")
    add_imgs("heizungslabelFotos", "Foto zum Heizungslabel")
    add_imgs("bedienungsanleitungFotos", "Foto zur Bedienungsanleitung")

    print(f"DEBUG: img_sources after populating: {img_sources}")
    
    # Calculate number of pages needed
    total_images = len(img_sources)
    if total_images == 0:
        num_pages = 2  # Just first 2 pages
    else:
        num_pages = min(7, 2 + (total_images + 1) // 2)  # 2 base pages + 1 page per 2 images, max 7 pages
    
    # Group images into pairs for each page
    img_groups = [img_sources[i:i+2] for i in range(0, len(img_sources), 2)]
    print(f"DEBUG: img_groups created: {img_groups}")

    photo_note = (
        "Es wurden keine Fotos bereitgestellt." if not img_sources else
        "Es wurde ein Foto bereitgestellt, welches auf Seite 3 abgebildet ist." if len(img_sources) == 1 else
        "Es wurden Fotos bereitgestellt, welche ab Seite 3 abgebildet sind."
    )
    
    # Adjust Y coordinates for kein_weiterbetrieb template
    y_offset = 20 if template_to_use == "template_blanco_kein_weiterbetrieb.pdf" else 0
    
    fields = {
        0: [
            (f"{row_data.get('strasse', '')} {row_data.get('hausnummer', '')},", 298, 494 + y_offset, 'center', 20, "bold", 210),
            (f"{row_data.get('postleitzahl', '')} {row_data.get('ort', '')}", 298, 474 + y_offset, 'center', 20, "bold", 210),
            (row_data.get('heizungsart', ''), 300, 595 + y_offset, 'center', 20, 'bold', None),
            (row_data.get('heizungshersteller', ''), 225, 422 + y_offset, 'left', 13, 'bold', 90),
            (row_data.get('heizungstechnik', ''), 160, 392 + y_offset, 'left', 13, 'bold', 150),
            (row_data.get('energietraeger', ''), 173, 362 + y_offset, 'left', 13, 'bold', None),
            (energy_date, 184, 331 + y_offset, 'left', 13, 'bold', None),
            (name, 229.5, 300.5 + y_offset, 'left', 13, 'bold', 250),
            (row_data.get('baujahr', ''), 456, 422 + y_offset, 'left', 13, 'bold', None),
            (efh, 356, 392 + y_offset, 'left', 13, 'bold', None),
            (central, 419, 362 + y_offset, 'left', 13, 'bold', None),
            (row_data.get('typenbezeichnung', ''), 443, 331 + y_offset, 'left', 13, 'bold', 100),
            (display_year_text, 345, 254 + y_offset, 'left', 18, 'bold', None), 
            (photo_note, 43, 170 + y_offset, 'left', 11, 'normal', None),
            (datetime.now().strftime("%d.%m.%Y"), 107, 126 + y_offset, 'center', 11, 'normal', None),
        ],
        1: [
            (f"{row_data.get('strasse', '')} {row_data.get('hausnummer', '')}", 297.6, 158 + y_offset, 'center', 20, 'bold', 220),
            (f"{row_data.get('postleitzahl', '')} {row_data.get('ort', '')}", 297.6, 138 + y_offset, 'center', 20, 'bold', 220),
        ]
    }

    # Add image pages
    for i, group in enumerate(img_groups):
        page_idx = i + 2
        if page_idx >= num_pages:  # Stop if we've reached the maximum number of pages
            break
            
        fields[page_idx] = [
            (f"{row_data.get('strasse', '')} {row_data.get('hausnummer', '')}", 297.6, 158 + y_offset, 'center', 20, 'bold', 220),
            (f"{row_data.get('postleitzahl', '')} {row_data.get('ort', '')}", 297.6, 138 + y_offset, 'center', 20, 'bold', 220),
        ]
        y_top = 460
        for j, (url, label) in enumerate(group):
            try:
                print(f"DEBUG: Processing image URL: {url}")
                # Download image from URL
                response = requests.get(url)
                if response.status_code == 200:
                    print(f"DEBUG: Successfully downloaded image from {url}")
                    img_data = BytesIO(response.content)
                    img = Image.open(img_data)
                    width, height = img.size
                    ratio = 180 / height  # Scale to 180px height
                    img_w = int(width * ratio)
                    img_h = 180
                    x_pos = A4[0] / 2 - img_w / 2
                    y_pos = y_top - j * (img_h + 60)
                    print(f"DEBUG: Image dimensions - Original: {width}x{height}, Scaled: {img_w}x{img_h}")
                    print(f"DEBUG: Image position - x: {x_pos}, y: {y_pos}")
                    # Reset the BytesIO position before adding to fields
                    img_data.seek(0)
                    fields[page_idx].append((label, A4[0]/2, y_pos + img_h + 15, 'center', 11, 'bold', 200))
                    fields[page_idx].append((img_data, x_pos, y_pos, '', 0, '', 0, 'image', img_w, img_h))
                    print(f"DEBUG: Successfully added image to page {page_idx}")
                else:
                    print(f"⚠️ Failed to download image from {url}. Status code: {response.status_code}")
            except Exception as e:
                print(f"⚠️ Error processing image {url}: {e}")
                import traceback
                print(traceback.format_exc())

    # Add only the required number of pages
    for i in range(num_pages):
        if i < len(template_reader.pages):
            page = template_reader.pages[i]
            if i in fields:
                overlay = create_overlay(fields[i])
                page.merge_page(overlay.pages[0])
            writer.add_page(page)

    pdf_buffer = BytesIO()
    writer.write(pdf_buffer)
    pdf_bytes = pdf_buffer.getvalue()
    pdf_buffer.close()
    return pdf_bytes

# Optional: temporäre Bilder löschen (Not relevant for serverless if not writing temp files)
# def cleanup_temp_images(): ...

# --- Serverless Handler --- #
class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        query_params = parse_qs(parsed_path.query)
        item_id = query_params.get('id', [None])[0]
        print(f"DEBUG: do_GET called for item_id: {item_id}")

        if not item_id:
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Missing id parameter'}).encode('utf-8'))
            return

        try:
            print(f"Fetching data for ID: {item_id}") # Server-side log
            data = fetch_heizungsplakette_data(item_id)
            print(f"DEBUG: Data fetched in do_GET for ID {item_id} (first 500 chars): {json.dumps(data, default=str)[:500] if data else 'No data found'}")
            if not data:
                self.send_response(404)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Data not found for id'}).encode('utf-8'))
                return

            print(f"Generating PDF for ID: {item_id}") # Server-side log
            pdf_bytes = generate_pdf_in_memory(data)
            
            print(f"PDF generated, sending {len(pdf_bytes)} bytes for ID: {item_id}") # Server-side log

            self.send_response(200)
            self.send_header('Content-type', 'application/pdf')
            self.send_header('Content-Disposition', f'attachment; filename="heizungsplakette_{item_id}.pdf"')
            self.send_header('Access-Control-Allow-Origin', '*') # Add CORS header if frontend is on a different Vercel domain during preview
            self.end_headers()
            self.wfile.write(pdf_bytes)

        except FileNotFoundError as fnf_error:
            print(f"ERROR in PDF generation (FileNotFound): {str(fnf_error)}")
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            error_response = {'error': f'Server error: Missing required file for PDF generation - {str(fnf_error)}'}
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
        except Exception as e:
            print(f"ERROR in PDF generation for ID {item_id}: {str(e)}")
            # Consider logging the full traceback here for better debugging
            # import traceback
            # print(traceback.format_exc())
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            # Be cautious about sending detailed internal errors to the client
            error_response = {'error': f'Failed to generate PDF: {str(e)}'} # Keep error message somewhat generic for client
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
        return

    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # Get the ID from the URL query parameters
            parsed_url = urlparse(self.path)
            query_params = parse_qs(parsed_url.query)
            item_id = query_params.get('id', [None])[0]
            
            if not item_id:
                self.send_error(400, "Missing id parameter")
                return

            # Get image rotations from the request body
            image_rotations = data.get('image_rotations', {})
            
            # Generate PDF with rotated images
            pdf_bytes = recreate_pdf_with_rotated_images(item_id, image_rotations)
            
            # Send the PDF response
            self.send_response(200)
            self.send_header('Content-Type', 'application/pdf')
            self.send_header('Content-Length', str(len(pdf_bytes)))
            self.end_headers()
            self.wfile.write(pdf_bytes)
            
        except Exception as e:
            print(f"Error in do_POST: {str(e)}")
            print(f"Traceback:\n{traceback.format_exc()}")
            self.send_error(500, f"Internal server error: {str(e)}")

# --- Command-Line Execution Block --- #
if __name__ == "__main__":
    # Setup argument parser
    parser = argparse.ArgumentParser(description="Generate Heizungsplakette PDF locally for testing.")
    parser.add_argument("--id", type=str, required=True, help="The ID (string) of the Heizungsplakette item in the database.")
    args = parser.parse_args()

    print(f"--- Local Test Run for ID: {args.id} ---")

    # Load environment variables from .env file
    # Ensure .env file exists in the project root or where you run the script
    load_dotenv(find_dotenv())

    try:
        # 1. Fetch data
        print(f"Fetching data for ID: {args.id}")
        row_data = fetch_heizungsplakette_data(args.id)

        if not row_data:
            print(f"Error: No data found for ID: {args.id}")
            sys.exit(1)
        
        # 2. Generate PDF
        print(f"Generating PDF for ID: {args.id}")
        # Uses the updated default template name from the function definition
        script_dir = os.path.dirname(__file__)
        # The template_file_path here was redundant if using default, removed it for clarity
        # template_file_path = os.path.join(script_dir, "template_blanco.pdf") 
        pdf_bytes = generate_pdf_in_memory(row_data) # Calls function which uses the correct default
        
        # 3. Save PDF locally
        output_dir = "Heizungsplaketten_Local_Test"
        os.makedirs(output_dir, exist_ok=True)
        
        safe_nachname = str(row_data.get('nachname', 'N_A')).strip().replace(' ', '_')
        safe_vorname = str(row_data.get('vorname', 'V_A')).strip().replace(' ', '_')
        base_filename = f"Heizungsplakette_{safe_nachname}_{safe_vorname}_{args.id}"
        
        # Simple unique filename handling for local test
        counter = 1
        output_filename = f"{base_filename}.pdf"
        output_path = os.path.join(output_dir, output_filename)
        while os.path.exists(output_path):
            output_filename = f"{base_filename}_{counter}.pdf"
            output_path = os.path.join(output_dir, output_filename)
            counter += 1
            
        with open(output_path, "wb") as f:
            f.write(pdf_bytes)
        print(f"✅ Successfully generated PDF and saved locally to: {output_path}")

    except FileNotFoundError as e:
        print(f"ERROR: File not found - {str(e)}")
        print("Ensure the PDF template and image assets are correctly placed relative to the script.")
        sys.exit(1)
    except ConnectionError as e:
        print(f"ERROR: Database Connection - {str(e)}")
        print("Ensure DATABASE_URL is set correctly in your .env file or environment.")
        sys.exit(1)
    except Exception as e:
        print(f"ERROR: An unexpected error occurred - {str(e)}")
        sys.exit(1)

# Add after the scale_image function
def rotate_image(image_data, rotation_degrees):
    """Rotate an image by specified degrees (clockwise)."""
    try:
        img = Image.open(image_data)
        # Convert to RGB if necessary (for PNG with transparency)
        if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
            img = img.convert('RGB')
        rotated_img = img.rotate(-rotation_degrees, expand=True)  # Negative for clockwise
        output = BytesIO()
        rotated_img.save(output, format='JPEG', quality=95)
        output.seek(0)
        return output
    except Exception as e:
        print(f"⚠️ Error rotating image: {e}")
        print(f"Traceback:\n{traceback.format_exc()}")
        return image_data

def recreate_pdf_with_rotated_images(item_id, image_rotations=None):
    """
    Recreate PDF with rotated images.
    image_rotations: dict of image URLs and their rotation degrees (90, 180, 270)
    """
    try:
        print(f"DEBUG: Starting PDF recreation for ID {item_id} with rotations: {image_rotations}")
        # Fetch the original data
        data = fetch_heizungsplakette_data(item_id)
        if not data:
            raise ValueError(f"No data found for ID: {item_id}")

        # Process images with rotations
        img_sources = []
        def add_imgs_with_rotation(key_name, label):
            urls = safe_split(data.get(key_name))
            for url in urls:
                if url and url.startswith('http'):
                    rotation = image_rotations.get(url, 0) if image_rotations else 0
                    print(f"DEBUG: Adding image {url} with rotation {rotation}°")
                    img_sources.append((url, label, rotation))

        add_imgs_with_rotation("heizungsanlageFotos", "Foto zur Heizungsanlage")
        add_imgs_with_rotation("heizungsetiketteFotos", "Foto zum Typenschild")
        add_imgs_with_rotation("heizungslabelFotos", "Foto zum Heizungslabel")
        add_imgs_with_rotation("bedienungsanleitungFotos", "Foto zur Bedienungsanleitung")

        # Generate PDF with rotated images
        script_dir = os.path.dirname(__file__)
        font_base_path = os.path.join(script_dir, "fonts")
        montserrat_regular_path = os.path.join(font_base_path, "Montserrat-Regular.ttf")
        montserrat_bold_path = os.path.join(font_base_path, "Montserrat-Bold.ttf")
        pdfmetrics.registerFont(TTFont('Montserrat', montserrat_regular_path))
        pdfmetrics.registerFont(TTFont('Montserrat-Bold', montserrat_bold_path))

        # Conditional logic for template and year text
        darf_weiterbetrieben_werden = True
        display_year_text = '2044'
        template_to_use = "template_blanco.pdf"

        try:
            baujahr_str = str(data.get('baujahr', '0')).strip()
            if baujahr_str.isdigit():
                baujahr = int(baujahr_str)
                if baujahr > 0: # Basic validation for baujahr
                    heizung_alter = datetime.now().year - baujahr
                    heizungstechnik = str(data.get('heizungstechnik', '')).strip().lower()
                    
                    # Conditions for "kein Weiterbetrieb"
                    if heizung_alter > 30 and heizungstechnik not in ['brennwerttechnik', 'niedertemperaturkessel']:
                        darf_weiterbetrieben_werden = False
                        template_to_use = "template_blanco_kein_weiterbetrieb.pdf"
                        display_year_text = '' # No year text if "kein Weiterbetrieb"
            else:
                print(f"⚠️ Baujahr '{baujahr_str}' is not a valid year string for recreate. Defaulting to 'darf_weiterbetrieben_werden = True'.")
        except ValueError as ve:
            print(f"⚠️ Error converting Baujahr to int for recreate: {ve}. Defaulting to 'darf_weiterbetrieben_werden = True'.")
        except Exception as e_cond:
            print(f"⚠️ Error in conditional logic for recreate template: {e_cond}. Defaulting to 'darf_weiterbetrieben_werden = True'.")

        final_template_path = os.path.join(script_dir, template_to_use)
        print(f"DEBUG: Recreate PDF using template: {final_template_path}")
        try:
            template_reader = PdfReader(final_template_path)
        except FileNotFoundError:
            print(f"⚠️ PDF Template not found for recreate: {final_template_path}")
            raise
        
        writer = PdfWriter()
        name = f"{data.get('vorname', '')} {data.get('nachname', '')}"
        energy_date = parse_date(data.get('energieausweisDate')) if data.get('energieausweis') == 'Ja' else "Nicht vorhanden"
        efh = 'Ja' if data.get('artDerImmobilie') == 'Einfamilienhaus' else 'Nein'
        central = 'Ja' if data.get('heizsystem') == 'Zentralheizung' else 'Nein'

        total_images = len(img_sources)
        if total_images == 0:
            num_pages = 2
        else:
            num_pages = min(7, 2 + (total_images + 1) // 2)
        img_groups = [img_sources[i:i+2] for i in range(0, len(img_sources), 2)]
        photo_note = (
            "Es wurden keine Fotos bereitgestellt." if not img_sources else
            "Es wurde ein Foto bereitgestellt, welches auf Seite 3 abgebildet ist." if len(img_sources) == 1 else
            "Es wurden Fotos bereitgestellt, welche ab Seite 3 abgebildet sind."
        )
        # Adjust Y coordinates for kein_weiterbetrieb template
        y_offset = 20 if template_to_use == "template_blanco_kein_weiterbetrieb.pdf" else 0
        
        fields = {
            0: [
                (f"{data.get('strasse', '')} {data.get('hausnummer', '')},", 298, 494 + y_offset, 'center', 20, "bold", 210),
                (f"{data.get('postleitzahl', '')} {data.get('ort', '')}", 298, 474 + y_offset, 'center', 20, "bold", 210),
                (data.get('heizungsart', ''), 300, 595 + y_offset, 'center', 20, 'bold', None),
                (data.get('heizungshersteller', ''), 225, 422 + y_offset, 'left', 13, 'bold', 90),
                (data.get('heizungstechnik', ''), 160, 392 + y_offset, 'left', 13, 'bold', 150),
                (data.get('energietraeger', ''), 173, 362 + y_offset, 'left', 13, 'bold', None),
                (energy_date, 184, 331 + y_offset, 'left', 13, 'bold', None),
                (name, 229, 300 + y_offset, 'left', 13, 'bold', 250),
                (data.get('baujahr', ''), 456, 422 + y_offset, 'left', 13, 'bold', None),
                (efh, 356, 392 + y_offset, 'left', 13, 'bold', None),
                (central, 419, 362 + y_offset, 'left', 13, 'bold', None),
                (data.get('typenbezeichnung', ''), 443, 331 + y_offset, 'left', 13, 'bold', 100),
                (display_year_text, 345, 254 + y_offset, 'left', 18, 'bold', None),
                (photo_note, 43, 170 + y_offset, 'left', 11, 'normal', None),
                (datetime.now().strftime("%d.%m.%Y"), 107, 126 + y_offset, 'center', 11, 'normal', None),
            ],
            1: [
                (f"{data.get('strasse', '')} {data.get('hausnummer', '')}", 297.6, 158 + y_offset, 'center', 20, 'bold', 220),
                (f"{data.get('postleitzahl', '')} {data.get('ort', '')}", 297.6, 138 + y_offset, 'center', 20, 'bold', 220),
            ]
        }

        for i, group in enumerate(img_groups):
            page_idx = i + 2
            if page_idx >= num_pages:
                break
            fields[page_idx] = [
                (f"{data.get('strasse', '')} {data.get('hausnummer', '')}", 297.6, 158 + y_offset, 'center', 20, 'bold', 220),
                (f"{data.get('postleitzahl', '')} {data.get('ort', '')}", 297.6, 138 + y_offset, 'center', 20, 'bold', 220),
            ]
            y_top = 460
            for j, (url, label, rotation) in enumerate(group):
                try:
                    print(f"DEBUG: Processing image {url} with rotation {rotation}°")
                    response = requests.get(url)
                    if response.status_code == 200:
                        img_data = BytesIO(response.content)
                        if rotation != 0:
                            print(f"DEBUG: Rotating image {url} by {rotation}°")
                            img_data = rotate_image(img_data, rotation)
                        img = Image.open(img_data)
                        width, height = img.size
                        ratio = 180 / height
                        img_w = int(width * ratio)
                        img_h = 180
                        x_pos = A4[0] / 2 - img_w / 2
                        y_pos = y_top - j * (img_h + 60)
                        img_data.seek(0)
                        fields[page_idx].append((label, A4[0]/2, y_pos + img_h + 15, 'center', 11, 'bold', 200))
                        fields[page_idx].append((img_data, x_pos, y_pos, '', 0, '', 0, 'image', img_w, img_h))
                        print(f"DEBUG: Successfully added rotated image to page {page_idx}")
                    else:
                        print(f"⚠️ Failed to download image from {url}. Status code: {response.status_code}")
                except Exception as e:
                    print(f"⚠️ Error processing image {url}: {e}")
                    print(f"Traceback:\n{traceback.format_exc()}")

        for i in range(num_pages):
            if i < len(template_reader.pages):
                page = template_reader.pages[i]
                if i in fields:
                    overlay = create_overlay(fields[i])
                    page.merge_page(overlay.pages[0])
                writer.add_page(page)

        pdf_buffer = BytesIO()
        writer.write(pdf_buffer)
        pdf_bytes = pdf_buffer.getvalue()
        pdf_buffer.close()
        print(f"DEBUG: Successfully generated PDF with rotations for ID {item_id}")
        return pdf_bytes
    except Exception as e:
        print(f"⚠️ Error recreating PDF: {e}")
        print(f"Traceback:\n{traceback.format_exc()}")
        raise