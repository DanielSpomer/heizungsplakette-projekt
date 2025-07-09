#!/usr/bin/env python3
"""
Temporary script to add signature images permanently to PDF templates.
This script will be deleted after use.
"""

import os
from io import BytesIO
from PyPDF2 import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4


def create_signature_overlay(signature_paths, width=A4[0], height=A4[1], y_offset=0):
    """
    Create an overlay with signature images.
    
    Args:
        signature_paths: dict with signature images {"owner": "path/to/owner_sig.png", "official": "path/to/official_sig.png"}
        width: PDF width
        height: PDF height
        y_offset: Y offset for positioning (0 for normal template, -2 for kein_weiterbetrieb)
    """
    try:
        print(f"     🎨 Creating overlay canvas {width}x{height} with y_offset={y_offset}")
        buf = BytesIO()
        c = canvas.Canvas(buf, pagesize=(width, height))
        
        # Owner signature position (left side)
        owner_sig_x = 270  # Center around x=107, signature width ~100px
        owner_sig_y = 109 + y_offset  # Above the label
        owner_sig_width = 124*1.5
        owner_sig_height = 26*1.5
        
        # Official signature position (right side)
        official_sig_x = 200  # Center around x=430, signature width ~150px
        official_sig_y = 92 + y_offset  # Above the label
        official_sig_width = 70*0.9
        official_sig_height = 90*0.9
        
        signatures_added = 0
        
        # Add owner signature if provided
        if "owner" in signature_paths and signature_paths["owner"]:
            if os.path.exists(signature_paths["owner"]):
                try:
                    print(f"     🖊️ Adding owner signature: {signature_paths['owner']}")
                    c.drawImage(signature_paths["owner"], 
                               owner_sig_x, owner_sig_y, 
                               width=owner_sig_width, height=owner_sig_height, 
                               mask='auto')
                    print(f"     ✅ Owner signature added successfully")
                    signatures_added += 1
                except Exception as e:
                    print(f"     ⚠️ Error adding owner signature: {e}")
            else:
                print(f"     ⚠️ Owner signature file not found: {signature_paths['owner']}")
        
        # Add official signature if provided
        if "official" in signature_paths and signature_paths["official"]:
            if os.path.exists(signature_paths["official"]):
                try:
                    print(f"     🖊️ Adding official signature: {signature_paths['official']}")
                    c.drawImage(signature_paths["official"], 
                               official_sig_x, official_sig_y, 
                               width=official_sig_width, height=official_sig_height, 
                               mask='auto')
                    print(f"     ✅ Official signature added successfully")
                    signatures_added += 1
                except Exception as e:
                    print(f"     ⚠️ Error adding official signature: {e}")
            else:
                print(f"     ⚠️ Official signature file not found: {signature_paths['official']}")
        
        print(f"     📊 Added {signatures_added} signatures to overlay")
        
        # Ensure at least one page exists by drawing something (even if invisible)
        c.setFillColorRGB(1, 1, 1)  # White color (invisible)
        c.rect(0, 0, 1, 1, fill=1)   # Draw a tiny invisible rectangle to force page creation
        
        # Always save the canvas, even if no signatures were added
        c.save()
        buf.seek(0)
        
        # Create PDF reader from the buffer
        overlay_reader = PdfReader(buf)
        print(f"     📄 Overlay PDF created with {len(overlay_reader.pages)} pages")
        return overlay_reader
        
    except Exception as e:
        print(f"     ❌ Error creating signature overlay: {e}")
        import traceback
        print(f"     🐛 Traceback: {traceback.format_exc()}")
        # Return empty overlay in case of error
        buf = BytesIO()
        c = canvas.Canvas(buf, pagesize=(width, height))
        # Ensure at least one page exists
        c.setFillColorRGB(1, 1, 1)  # White color (invisible)
        c.rect(0, 0, 1, 1, fill=1)   # Draw a tiny invisible rectangle to force page creation
        c.save()
        buf.seek(0)
        return PdfReader(buf)


def add_signatures_to_template(template_path, output_path, signature_paths, y_offset=0):
    """
    Add signatures to a PDF template.
    
    Args:
        template_path: Path to the original template
        output_path: Path where to save the modified template
        signature_paths: dict with signature image paths
        y_offset: Y offset for positioning
    """
    try:
        print(f"   📖 Reading template: {template_path}")
        # Read the original template
        template_reader = PdfReader(template_path)
        print(f"   📄 Template has {len(template_reader.pages)} pages")
        
        if len(template_reader.pages) == 0:
            print(f"   ❌ Template has no pages!")
            return
            
        writer = PdfWriter()
        
        # Process first page (main page with signatures)
        page = template_reader.pages[0]
        print(f"   🖊️ Creating signature overlay with y_offset={y_offset}")
        
        # Create signature overlay
        signature_overlay = create_signature_overlay(signature_paths, y_offset=y_offset)
        print(f"   📄 Overlay has {len(signature_overlay.pages)} pages")
        
        if len(signature_overlay.pages) == 0:
            print(f"   ❌ Signature overlay has no pages!")
            return
            
        # Merge the overlay with the page
        page.merge_page(signature_overlay.pages[0])
        writer.add_page(page)
        
        # Add remaining pages unchanged
        for i in range(1, len(template_reader.pages)):
            writer.add_page(template_reader.pages[i])
        
        # Save the modified template
        print(f"   💾 Saving to: {output_path}")
        with open(output_path, 'wb') as output_file:
            writer.write(output_file)
        
        print(f"✅ Successfully created {output_path}")
        
    except Exception as e:
        print(f"❌ Error processing {template_path}: {e}")
        import traceback
        print(f"   🐛 Traceback: {traceback.format_exc()}")


def main():
    """Main function to add signatures to both templates."""
    script_dir = os.path.dirname(__file__)
    
    # Configuration - ADJUST THESE PATHS TO YOUR SIGNATURE IMAGES
    signature_paths = {
        "owner": os.path.join(script_dir, "UnterschriftCarsten.png"),  # Replace with actual path to owner signature image
        "official": os.path.join(script_dir, "UnterschriftSven.png")  # Replace with actual path to official signature image
    }
    
    # Template paths
    templates = [
        {
            "input": os.path.join(script_dir, "template_blanco_kein_weiterbetrieb.pdf"),
            "output": os.path.join(script_dir, "template_blanco_kein_weiterbetrieb_with_signatures.pdf"),
            "y_offset": 0
        }
    ]
    
    print("🔧 Adding signatures to PDF templates...")
    print("\n📋 Configuration:")
    print(f"   Owner signature: {signature_paths.get('owner', 'NOT SET')}")
    print(f"   Official signature: {signature_paths.get('official', 'NOT SET')}")
    
    # Check if signature files exist
    missing_files = []
    for sig_type, sig_path in signature_paths.items():
        if not os.path.exists(sig_path):
            missing_files.append(f"{sig_type}: {sig_path}")
    
    if missing_files:
        print(f"\n⚠️ Warning: The following signature files were not found:")
        for missing in missing_files:
            print(f"   - {missing}")
        print("   (Templates will be processed but signatures won't be added)")
    
    print(f"\n🚀 Processing templates...")
    
    # Process each template
    for template in templates:
        print(f"\n📄 Processing {os.path.basename(template['input'])}...")
        add_signatures_to_template(
            template["input"], 
            template["output"], 
            signature_paths, 
            template["y_offset"]
        )
    
    print(f"\n✅ Done! Modified templates saved with '_with_signatures' suffix")
    print(f"📝 Next steps:")
    print(f"   1. Review the generated templates")
    print(f"   2. If satisfied, replace the original templates:")
    print(f"      - Backup originals first!")
    print(f"      - Rename template_blanco_with_signatures.pdf to template_blanco.pdf")
    print(f"      - Rename template_blanco_kein_weiterbetrieb_with_signatures.pdf to template_blanco_kein_weiterbetrieb.pdf")
    print(f"   3. Delete this script: rm {__file__}")


if __name__ == "__main__":
    main() 