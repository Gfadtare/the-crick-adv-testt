import os
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

# Brand Colors
COLOR_NAVY_HEX = "0F1E3D"
COLOR_GOLD_HEX = "D4AF37"
COLOR_TEXT_HEX = "334155"
COLOR_LIGHT_BG_HEX = "FAFBFD"

RGB_NAVY = RGBColor(15, 30, 61)
RGB_GOLD = RGBColor(212, 175, 55)
RGB_TEXT = RGBColor(51, 65, 85)

# Fonts
FONT_HEADING = "Montserrat"
FONT_BODY = "Poppins"

def set_cell_border(cell, **kwargs):
    """
    Set cell borders.
    Format: set_cell_border(cell, bottom={"sz": 12, "val": "single", "color": "D4AF37"})
    sz is in 1/8 pt. sz=12 means 1.5 pt.
    """
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcBorders = tcPr.first_child_found_in("w:tcBorders")
    if tcBorders is None:
        tcBorders = OxmlElement('w:tcBorders')
        tcPr.append(tcBorders)
    
    for edge in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
        edge_data = kwargs.get(edge)
        if edge_data:
            tag = f'w:{edge}'
            element = tcBorders.find(qn(tag))
            if element is None:
                element = OxmlElement(tag)
                tcBorders.append(element)
            for key, val in edge_data.items():
                element.set(qn(f'w:{key}'), str(val))

def set_cell_background(cell, color_hex):
    """Set background color of a cell."""
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shd)

def set_cell_margins(cell, top=0, bottom=0, left=0, right=0):
    """Set cell margins in dxa (1 pt = 20 dxa)."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for name, val in [('w:top', top), ('w:bottom', bottom), ('w:left', left), ('w:right', right)]:
        node = OxmlElement(name)
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def create_document():
    doc = Document()
    
    # 1. Page Margins & Setup
    section = doc.sections[0]
    section.top_margin = Inches(1.8)     # Space for first page header
    section.bottom_margin = Inches(1.2)  # Space for footer
    section.left_margin = Inches(0.8)
    section.right_margin = Inches(0.8)
    
    section.header_distance = Inches(0.4)
    section.footer_distance = Inches(0.4)
    
    # Enable different first page headers/footers
    section.different_first_page_header_footer = True
    
    # 2. Base Styles
    # Normal Style (Body text)
    normal_style = doc.styles['Normal']
    normal_font = normal_style.font
    normal_font.name = FONT_BODY
    normal_font.size = Pt(10.5)
    normal_font.color.rgb = RGB_TEXT
    
    normal_format = normal_style.paragraph_format
    normal_format.line_spacing = 1.15
    normal_format.space_after = Pt(8)
    
    # Heading 1 Style
    h1_style = doc.styles['Heading 1']
    h1_font = h1_style.font
    h1_font.name = FONT_HEADING
    h1_font.size = Pt(15)
    h1_font.bold = True
    h1_font.color.rgb = RGB_NAVY
    h1_style.paragraph_format.space_before = Pt(12)
    h1_style.paragraph_format.space_after = Pt(4)
    
    # Heading 2 Style
    h2_style = doc.styles['Heading 2']
    h2_font = h2_style.font
    h2_font.name = FONT_HEADING
    h2_font.size = Pt(12)
    h2_font.bold = True
    h2_font.color.rgb = RGB_GOLD
    h2_style.paragraph_format.space_before = Pt(10)
    h2_style.paragraph_format.space_after = Pt(3)

    # 3. Create First Page Header
    first_page_header = section.first_page_header
    
    # We use a 1x2 table for header layout to align Logo left and Brand details right
    # Printable width: 8.5" page - 1.6" margins = 6.9"
    header_table = first_page_header.add_table(rows=1, cols=2, width=Inches(6.9))
    header_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    header_table.autofit = False
    
    # Set column widths
    header_table.columns[0].width = Inches(2.2) # Left: Logo
    header_table.columns[1].width = Inches(4.7) # Right: Text details
    
    cell_logo = header_table.cell(0, 0)
    cell_text = header_table.cell(0, 1)
    
    # Padding
    set_cell_margins(cell_logo, top=0, bottom=120, left=0, right=0)
    set_cell_margins(cell_text, top=0, bottom=120, left=0, right=0)
    
    # Insert Logo
    logo_path = os.path.abspath("public/the_cricket_advisor_logo.png")
    if os.path.exists(logo_path):
        p_logo = cell_logo.paragraphs[0]
        p_logo.alignment = WD_ALIGN_PARAGRAPH.LEFT
        run_logo = p_logo.add_run()
        # Scale to 1.8 inches wide
        run_logo.add_picture(logo_path, width=Inches(1.8))
    else:
        # Fallback text if logo file is not found
        p_logo = cell_logo.paragraphs[0]
        p_logo.alignment = WD_ALIGN_PARAGRAPH.LEFT
        run_logo = p_logo.add_run("[ Logo Placeholder ]")
        run_logo.font.name = FONT_HEADING
        run_logo.font.size = Pt(14)
        run_logo.font.bold = True
        run_logo.font.color.rgb = RGB_GOLD
        
    # Insert Branding Text
    p_brand = cell_text.paragraphs[0]
    p_brand.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    
    run_name = p_brand.add_run("THE CRICKET ADVISOR\n")
    run_name.font.name = FONT_HEADING
    run_name.font.size = Pt(16)
    run_name.font.bold = True
    run_name.font.color.rgb = RGB_NAVY
    
    run_tagline = p_brand.add_run("Your Premier Cricket Consultation & Coaching Guide\n")
    run_tagline.font.name = FONT_BODY
    run_tagline.font.size = Pt(8.5)
    run_tagline.font.italic = True
    run_tagline.font.color.rgb = RGB_GOLD
    
    run_contact = p_brand.add_run("www.thecricketadvisor.com  |  booking@thecricketadvisor.com")
    run_contact.font.name = FONT_BODY
    run_contact.font.size = Pt(8)
    run_contact.font.color.rgb = RGB_TEXT
    
    # Border under header
    # Double divider: Top cell border bottom of Navy, then space.
    # In docx, we can set a 2pt Navy bottom border to the cell.
    set_cell_border(cell_logo, bottom={"sz": 16, "val": "single", "color": COLOR_NAVY_HEX})
    set_cell_border(cell_text, bottom={"sz": 16, "val": "single", "color": COLOR_NAVY_HEX})
    
    # Let's add a thin Gold line below the header table using a paragraph border or a small spacer
    # A cleaner way is to make the header table have 2 rows, where row 2 is a very thin cell acting as a divider!
    # Let's stick to the cell bottom border which looks very clean and reliable.

    # 4. Create First Page Footer
    first_page_footer = section.first_page_footer
    footer_table = first_page_footer.add_table(rows=1, cols=1, width=Inches(6.9))
    footer_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    footer_cell = footer_table.cell(0, 0)
    
    set_cell_margins(footer_cell, top=100, bottom=0, left=0, right=0)
    set_cell_border(footer_cell, top={"sz": 8, "val": "single", "color": COLOR_GOLD_HEX}) # Thin Gold border on top of footer
    
    p_footer = footer_cell.paragraphs[0]
    p_footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    run_footer_addr = p_footer.add_run("The Cricket Advisor  •  Mumbai, India  •  Phone: +91 98765 43210\n")
    run_footer_addr.font.name = FONT_BODY
    run_footer_addr.font.size = Pt(8.5)
    run_footer_addr.font.color.rgb = RGB_TEXT
    
    run_footer_web = p_footer.add_run("Website: www.thecricketadvisor.com  |  Support & Bookings: booking@thecricketadvisor.com")
    run_footer_web.font.name = FONT_BODY
    run_footer_web.font.size = Pt(8.5)
    run_footer_web.font.color.rgb = RGB_TEXT
    
    # 5. Create Subsequent Pages Header (Smaller, elegant)
    sub_header = section.header
    sub_table = sub_header.add_table(rows=1, cols=2, width=Inches(6.9))
    sub_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    sub_cell_left = sub_table.cell(0, 0)
    sub_cell_right = sub_table.cell(0, 1)
    
    set_cell_margins(sub_cell_left, top=0, bottom=60, left=0, right=0)
    set_cell_margins(sub_cell_right, top=0, bottom=60, left=0, right=0)
    set_cell_border(sub_cell_left, bottom={"sz": 6, "val": "single", "color": COLOR_GOLD_HEX})
    set_cell_border(sub_cell_right, bottom={"sz": 6, "val": "single", "color": COLOR_GOLD_HEX})
    
    p_sub_left = sub_cell_left.paragraphs[0]
    p_sub_left.alignment = WD_ALIGN_PARAGRAPH.LEFT
    run_sub_left = p_sub_left.add_run("The Cricket Advisor")
    run_sub_left.font.name = FONT_HEADING
    run_sub_left.font.size = Pt(9.5)
    run_sub_left.font.bold = True
    run_sub_left.font.color.rgb = RGB_NAVY
    
    p_sub_right = sub_cell_right.paragraphs[0]
    p_sub_right.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run_sub_right = p_sub_right.add_run("Official Letterhead")
    run_sub_right.font.name = FONT_BODY
    run_sub_right.font.size = Pt(8.5)
    run_sub_right.font.color.rgb = RGB_TEXT
    
    # 6. Create Subsequent Pages Footer
    sub_footer = section.footer
    sub_footer_table = sub_footer.add_table(rows=1, cols=1, width=Inches(6.9))
    sub_footer_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    sub_footer_cell = sub_footer_table.cell(0, 0)
    
    set_cell_margins(sub_footer_cell, top=100, bottom=0, left=0, right=0)
    set_cell_border(sub_footer_cell, top={"sz": 6, "val": "single", "color": COLOR_GOLD_HEX})
    
    p_sub_foot = sub_footer_cell.paragraphs[0]
    p_sub_foot.alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    run_sub_foot = p_sub_foot.add_run("The Cricket Advisor  •  www.thecricketadvisor.com  •  booking@thecricketadvisor.com")
    run_sub_foot.font.name = FONT_BODY
    run_sub_foot.font.size = Pt(8)
    run_sub_foot.font.color.rgb = RGB_TEXT

    # 7. Add Content (The Letter Template)
    # Add a spacer run to move down a bit from header if needed
    p_space = doc.add_paragraph()
    p_space.paragraph_format.space_before = Pt(12)
    p_space.paragraph_format.space_after = Pt(12)
    
    # Date block
    p_date = doc.add_paragraph()
    p_date.paragraph_format.space_after = Pt(14)
    run_date = p_date.add_run("Date: July 25, 2026")
    run_date.font.bold = True
    
    # Recipient Block
    p_recipient = doc.add_paragraph()
    p_recipient.paragraph_format.space_after = Pt(18)
    p_recipient.add_run("To,\n")
    run_recipient_name = p_recipient.add_run("[Recipient Name]\n")
    run_recipient_name.font.bold = True
    p_recipient.add_run("[Recipient Designation]\n")
    p_recipient.add_run("[Recipient Organization]\n")
    p_recipient.add_run("[Street Address]\n")
    p_recipient.add_run("[City, State, Country]")
    
    # Subject Block
    p_subject = doc.add_paragraph()
    p_subject.paragraph_format.space_after = Pt(14)
    run_subject_label = p_subject.add_run("SUBJECT: ")
    run_subject_label.font.name = FONT_HEADING
    run_subject_label.font.bold = True
    run_subject_label.font.color.rgb = RGB_NAVY
    
    run_subject_text = p_subject.add_run("OFFICIAL LETTERHEAD TEMPLATE & BRAND GUIDELINES")
    run_subject_text.font.name = FONT_HEADING
    run_subject_text.font.bold = True
    run_subject_text.font.color.rgb = RGB_NAVY
    
    # Salutation
    p_salutation = doc.add_paragraph()
    p_salutation.paragraph_format.space_after = Pt(10)
    p_salutation.add_run("Dear [Recipient Name],")
    
    # Body Text
    p_body1 = doc.add_paragraph()
    p_body1.add_run(
        "Welcome to the official letterhead of The Cricket Advisor. This template is designed in accordance with our "
        "organization's branding system. It utilizes our primary colors: Deep Navy (#0F1E3D) representing professionalism, "
        "trust, and depth, combined with Royal Gold (#D4AF37) which signifies premium quality, expertise, and achievement. "
        "To maintain consistency, please ensure all corporate letters, updates, and advisories use this layout."
    )
    
    p_body2 = doc.add_paragraph()
    p_body2.add_run(
        "This Word document includes a pre-configured header on the first page containing our official logo, organization name, "
        "and contact channels. The margins are set to 0.8 inches on the left and right, and 1.8 inches on the top of the first page to "
        "prevent overlapping with the branding header. Subsequent pages will automatically display a simplified, space-efficient header "
        "to maximize printable area while retaining brand visibility."
    )
    
    p_body3 = doc.add_paragraph()
    p_body3.add_run(
        "When typing your content, you can utilize the Heading 1 and Heading 2 styles directly from Microsoft Word's styles panel "
        "to format sections. They are styled with Montserrat/Arial in our brand colors. For the main body text, we recommend using "
        "Poppins or Arial at 10.5pt size with a line spacing of 1.15 for readability."
    )
    
    # Sign-off Block
    p_signoff = doc.add_paragraph()
    p_signoff.paragraph_format.space_before = Pt(24)
    p_signoff.paragraph_format.space_after = Pt(36) # Space for physical signature
    p_signoff.add_run("Sincerely,\n\n\n\n")
    
    run_sig_name = p_signoff.add_run("[Authorized Signatory Name]\n")
    run_sig_name.font.bold = True
    run_sig_name.font.color.rgb = RGB_NAVY
    p_signoff.add_run("[Designation/Role]\n")
    run_team = p_signoff.add_run("The Cricket Advisor")
    run_team.font.bold = True
    
    # Save the document
    output_filename = "The_Cricket_Advisor_Letterhead.docx"
    doc.save(output_filename)
    print(f"Letterhead successfully generated and saved to {output_filename}")

if __name__ == "__main__":
    create_document()
