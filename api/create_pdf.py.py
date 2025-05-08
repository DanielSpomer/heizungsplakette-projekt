import os
import sys
import pandas as pd
from datetime import datetime
from io import BytesIO
from PIL import Image, ImageTk
from PyPDF2 import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import tkinter as tk

# For testing: opens the output PDF using the OS default
def open_pdf_if_testing(path: str):
    try:
        if os.name == "nt":
            os.startfile(path)
        elif sys.platform == "darwin":
            os.system(f"open '{path}'")
        else:
            os.system(f"xdg-open '{path}'")
    except Exception as e:
        print(f"⚠️ Could not open PDF: {e}")

# Ensures new file name if output file already exists
def get_unique_filename(base_path, ext=".pdf"):
    counter = 1
    path = f"{base_path}{ext}"
    while os.path.exists(path):
        counter += 1
        path = f"{base_path}_{counter}{ext}"
    return path

# Safely split CSV fields into list, filtering out "nan"
def safe_split(value):
    if isinstance(value, float) and pd.isna(value):
        return []
    return [v.strip() for v in str(value).split(',') if v.strip().lower() != "nan"]

# Scale image proportionally to a given height
def scale_image(image_path, target_height):
    with Image.open(image_path) as img:
        width, height = img.size
        ratio = target_height / height
        return int(width * ratio), int(height * ratio)

# Try multiple formats to parse a date
def parse_date(date_str):
    formats = ["%B %d, %Y", "%d %B %Y", "%b %d, %Y", "%d %b %Y", "%Y-%m-%d"]
    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt).strftime("%d.%m.%Y")
        except ValueError:
            continue
    raise ValueError(f"Invalid date format: {date_str}")

# Draw overlay (text or image) onto one PDF page
def create_overlay(fields, width=A4[0], height=A4[1]):
    buf = BytesIO()
    c = canvas.Canvas(buf, pagesize=(width, height))
    c.setFillColorRGB(0, 0, 0)

    for field in fields:
        if len(field) > 7 and field[7] == "image":
            try:
                c.drawImage(field[0], field[1], field[2], width=field[8], height=field[9], mask='auto')
            except Exception as e:
                print(f"⚠️ Error loading image '{field[0]}': {e}")
            continue

        text, x, y, align, size, weight, max_width = field[:7]
        font = "Montserrat-Bold" if weight == "bold" else "Montserrat"
        text = str(text)

        while size > 4 and max_width and c.stringWidth(text, font, size) > max_width:
            size -= 0.5

        c.setFont(font, size)
        if align == "center":
            x -= c.stringWidth(text, font, size) / 2

        c.drawString(x, y, text)

    c.save()
    buf.seek(0)
    return PdfReader(buf)

# GUI zur Vorschau & Rotation
def preview_and_rotate_images_gui(image_paths):
    from tkinter import messagebox

    rotated_paths = []
    current_index = 0
    root = tk.Tk()
    root.title("Bildrotation für PDF")

    image_label = tk.Label(root)
    image_label.pack()

    info_label = tk.Label(root, text="", font=("Arial", 12))
    info_label.pack(pady=5)

    def update_image():
        path = image_paths[current_index]
        with Image.open(path) as img:
            img.thumbnail((600, 600))
            tk_img = ImageTk.PhotoImage(img)
        image_label.config(image=tk_img)
        info_label.config(text=f"{os.path.basename(path)} ({current_index + 1} von {len(image_paths)})")
        root.tk_img = tk_img  # wichtig: Referenz halten, sonst wird das Bild nicht angezeigt

    def rotate_and_continue(degrees):
        nonlocal current_index
        path = image_paths[current_index]
        with Image.open(path) as img:
            rotated = img.rotate(-degrees, expand=True)
            temp_path = f"{path}_rotated_temp.jpg"
            rotated.save(temp_path)
            rotated_paths.append(temp_path)
        current_index += 1
        if current_index >= len(image_paths):
            root.destroy()
        else:
            update_image()

    # Buttons unten
    btn_frame = tk.Frame(root)
    btn_frame.pack(pady=10)

    for deg in [0, 90, 180, 270]:
        tk.Button(btn_frame, text=f"{deg}°", width=10, command=lambda d=deg: rotate_and_continue(d)).pack(side=tk.LEFT, padx=5)

    # Erste Anzeige
    update_image()
    root.mainloop()
    return rotated_paths



# PDF-Generierung
def generate_pdf(template_path, csv_path):
    df = pd.read_csv(csv_path).tail(2)

    for _, row in df.iterrows():
        template = PdfReader(template_path)
        writer = PdfWriter()
        name = f"{row['vorname']} {row['nachname']}"

        energy_date = parse_date(row['energieausweisDate']) if row['energieausweis'] == 'Ja' else ""
        efh = 'Ja' if row['artDerImmobilie'] == 'Einfamilienhaus' else 'Nein'
        central = 'Ja' if row['heizsystem'] == 'Zentralheizung' else 'Nein'

        img_sources = []
        def add_imgs(column, label):
            for p in safe_split(row.get(column)):
                path = f"images/{p}"
                if os.path.exists(path):
                    img_sources.append((path, label))

        add_imgs("heizungsanlageFotos", "Foto zur Heizungsanlage")
        add_imgs("heizungsetiketteFotos", "Foto zum Typenschild")
        add_imgs("heizungslabelFotos", "Foto zum Heizungslabel")
        add_imgs("bedienungsanleitungFotos", "Foto zur Bedienungsanleitung")

        if TEST_MODE:
            rotated_paths = preview_and_rotate_images_gui([p for p, _ in img_sources])
            img_sources = [(new_path, label) for (_, label), new_path in zip(img_sources, rotated_paths)]

        img_groups = [img_sources[i:i+2] for i in range(0, len(img_sources), 2)]

        photo_note = (
            "Es wurden keine Fotos bereitgestellt." if not img_sources else
            "Es wurde ein Foto bereitgestellt, welches auf Seite 3 abgebildet ist." if len(img_sources) == 1 else
            "Es wurden Fotos bereitgestellt, welche ab Seite 3 abgebildet sind."
        )

        fields = {
            0: [
                (f"{row['strasse']} {row['hausnummer']},", 298, 494, 'center', 20, "bold", 210),
                (f"{row['postleitzahl']} {row['ort']}", 298, 474, 'center', 20, "bold", 210),
                (row['heizungsart'], 300, 595, 'center', 20, 'bold', None),
                (row['heizungshersteller'], 225, 422, 'left', 13, 'bold', 90),
                (row['heizungstechnik'], 160, 392, 'left', 13, 'bold', 150),
                (row['energietraeger'], 173, 362, 'left', 13, 'bold', None),
                (energy_date, 184, 331, 'left', 13, 'bold', None),
                (name, 229, 300, 'left', 13, 'bold', 250),
                (row['baujahr'], 456, 422, 'left', 13, 'bold', None),
                (efh, 356, 392, 'left', 13, 'bold', None),
                (central, 419, 362, 'left', 13, 'bold', None),
                (row['typenbezeichnung'], 443, 331, 'left', 13, 'bold', 100),
                ('2044', 345, 254, 'left', 18, 'bold', None),
                (photo_note, 43, 170, 'left', 11, 'normal', None),
                (datetime.now().strftime("%d.%m.%Y"), 107, 126, 'center', 11, 'normal', None),
                ('images/Unterschriften/UnterschriftSven.png', 210, 98, '', 0, '', 0, 'image', 56, 72),
                ('images/Unterschriften/UnterschriftCarsten.png', 265, 110, '', 0, '', 0, 'image', 173.8, 36)
            ],
            1: [
                (f"{row['strasse']} {row['hausnummer']}", 297.6, 158, 'center', 20, 'bold', 220),
                (f"{row['postleitzahl']} {row['ort']}", 297.6, 138, 'center', 20, 'bold', 220),
            ]
        }

        for i, group in enumerate(img_groups):
            page = i + 2
            if page > 6: break
            fields[page] = [
                (f"{row['strasse']} {row['hausnummer']}", 297.6, 158, 'center', 20, 'bold', 220),
                (f"{row['postleitzahl']} {row['ort']}", 297.6, 138, 'center', 20, 'bold', 220),
            ]
            y_top = 460
            for j, (path, label) in enumerate(group):
                img_w, img_h = scale_image(path, 180)
                x = A4[0] / 2 - img_w / 2
                y = y_top - j * (img_h + 60)
                fields[page].append((label, A4[0]/2, y + img_h + 15, 'center', 11, 'bold', 200))
                fields[page].append((path, x, y, '', 0, '', 0, 'image', img_w, img_h))

        max_page = max(1, max(fields.keys()))
        for i in range(max_page + 1):
            page = template.pages[i]
            if i in fields:
                overlay = create_overlay(fields[i])
                page.merge_page(overlay.pages[0])
            writer.add_page(page)

        os.makedirs("Heizungsplaketten", exist_ok=True)
        base_path = os.path.join("Heizungsplaketten", f"Heizungsplakette_{row['nachname'].strip().replace(' ', '_')}_{row['vorname'].strip().replace(' ', '_')}_{row['strasse'].strip().replace(' ', '_').replace('.', '')}_{str(row['hausnummer'])}")
        out_path = get_unique_filename(base_path)

        with open(out_path, "wb") as f:
            writer.write(f)
            print(f"✅ {out_path} created.")

        if TEST_MODE:
            open_pdf_if_testing(out_path)

# Optional: temporäre Bilder löschen
def cleanup_temp_images():
    for root, _, files in os.walk("images"):
        for file in files:
            if file.endswith("_rotated_temp.jpg"):
                os.remove(os.path.join(root, file))
                print(f"🗑️ Deleted temp file: {file}")

# Hauptprogramm
if __name__ == "__main__":
    name = input("Enter last name: ").strip()
    df = pd.read_csv("Heizungsplakette.csv")
    matches = df[df['nachname'].str.contains(name, case=False, na=False)]

    if matches.empty:
        print(f"⚠️ No entry for '{name}' found.")
        sys.exit()

    if len(matches) > 1:
        print("Multiple entries found:")
        for i, r in matches.iterrows():
            print(f"{i}: {r['vorname']} {r['nachname']} - {r['strasse']} {r['hausnummer']}, {r['postleitzahl']} {r['ort']}")
        try:
            index = int(input("Select entry number: ").strip())
            selected = matches.loc[index]
        except:
            print("⚠️ Invalid selection.")
            sys.exit()
    else:
        selected = matches.iloc[0]

    pdfmetrics.registerFont(TTFont("Montserrat", "fonts/Montserrat/static/Montserrat-Regular.ttf"))
    pdfmetrics.registerFont(TTFont("Montserrat-Bold", "fonts/Montserrat/static/Montserrat-Bold.ttf"))

    selected.to_frame().T.to_csv("filtered_heizungsplakette.csv", index=False)

    TEST_MODE = True
    generate_pdf("template_blanco.pdf", "filtered_heizungsplakette.csv")
    cleanup_temp_images()
