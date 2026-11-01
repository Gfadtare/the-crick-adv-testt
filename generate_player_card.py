import os
import sys
import argparse
from PIL import Image, ImageDraw, ImageFont

# Brand Colors (purple matching the template)
COLOR_PURPLE = (90, 24, 154)       # #5a189a
COLOR_LIGHT_PURPLE = (123, 44, 191) # #7b2cbf
COLOR_WHITE = (255, 255, 255)
COLOR_TEXT = (51, 65, 85)          # Slate gray for spec text

def generate_card(photo_path, name, batting, bowling, nationality, club, country, season, output_path):
    # Canvas Size: 1000 x 520 (matches template ratio)
    width = 1000
    height = 520
    
    # 1. Create base image
    im = Image.new('RGB', (width, height), color=COLOR_WHITE)
    draw = ImageDraw.Draw(im)
    
    # 2. Draw Diagonal Purple Stripes
    # Top-Left corner stripes
    draw.polygon([(0, 0), (120, 0), (0, 120)], fill=COLOR_PURPLE)
    draw.polygon([(0, 150), (45, 150), (0, 195)], fill=COLOR_LIGHT_PURPLE)
    
    # Bottom-Right corner stripes
    draw.polygon([(width, height), (width - 120, height), (width, height - 120)], fill=COLOR_PURPLE)
    draw.polygon([(width, height - 150), (width - 45, height - 150), (width, height - 195)], fill=COLOR_LIGHT_PURPLE)
    
    # 3. Load and Paste Player Photo
    if os.path.exists(photo_path):
        try:
            player_img = Image.open(photo_path)
            # Fit/scale player photo (target dimensions: 320 max width, 420 max height)
            player_img.thumbnail((320, 420))
            img_w, img_h = player_img.size
            paste_x = 75
            paste_y = (height - img_h) // 2
            im.paste(player_img, (paste_x, paste_y))
        except Exception as e:
            print(f"Error loading photo: {e}")
            draw.rectangle([(75, 50), (375, 470)], fill=(245, 245, 245), outline=COLOR_PURPLE, width=2)
            draw.text((120, 250), "[Photo Load Error]", fill=COLOR_TEXT)
    else:
        print(f"Photo not found at '{photo_path}'. Drawing placeholder box.")
        draw.rectangle([(75, 50), (375, 470)], fill=(245, 245, 245), outline=COLOR_PURPLE, width=2)
        draw.text((125, 250), "[Player Image]", fill=COLOR_TEXT)
        
    # 4. Load Fonts
    font_bold = None
    font_regular = None
    font_name = None
    
    # Search common font paths across OS
    font_paths = [
        "arial.ttf", "arialbd.ttf", "Arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "C:\\Windows\\Fonts\\arial.ttf",
        "C:\\Windows\\Fonts\\arialbd.ttf"
    ]
    
    for path in font_paths:
        try:
            if "bd" in path or "Bold" in path:
                font_bold = ImageFont.truetype(path, 15)
                font_name = ImageFont.truetype(path, 40)
            else:
                font_regular = ImageFont.truetype(path, 15)
        except:
            pass
            
    if not font_regular:
        font_regular = ImageFont.load_default()
    if not font_bold:
        font_bold = font_regular
    if not font_name:
        font_name = font_bold
        
    # 5. Draw Player Name
    name_parts = name.upper().split(' ')
    name_y = 60
    for part in name_parts:
        draw.text((450, name_y), part, fill=COLOR_PURPLE, font=font_name)
        name_y += 45
        
    # Horizontal divider rule below name
    draw.line([(450, name_y + 10), (920, name_y + 10)], fill=(226, 232, 240), width=2)
    start_y = name_y + 25
    
    # 6. Specs Data List
    specs = [
        ("BATTING STYLE", batting),
        ("BOWLING STYLE", bowling),
        ("NATIONALITY", nationality),
        ("PLAYER PLACED AT", club),
        ("PLAYER PLACED COUNTRY", country),
        ("SEASON", season)
    ]
    
    for label, val in specs:
        if not val:
            continue
            
        # Draw purple square background representing icon
        box_coords = [(450, start_y), (482, start_y + 32)]
        draw.rectangle(box_coords, fill=COLOR_PURPLE)
        
        # Draw some simple vector representations inside the icon boxes
        if label == "BATTING STYLE":
            # Simple bat diagonal line
            draw.line([(456, start_y + 26), (476, start_y + 6)], fill=COLOR_WHITE, width=3)
        elif label == "BOWLING STYLE":
            # Simple ball circle
            draw.ellipse([(458, start_y + 8), (474, start_y + 24)], outline=COLOR_WHITE, width=2)
        elif label == "NATIONALITY":
            # Simple human shape (head and shoulders)
            draw.ellipse([(462, start_y + 6), (470, start_y + 14)], fill=COLOR_WHITE)
            draw.arc([(458, start_y + 16), (474, start_y + 30)], 180, 360, fill=COLOR_WHITE, width=2)
        elif label == "PLAYER PLACED AT":
            # Simple building house shape
            draw.polygon([(466, start_y + 6), (458, start_y + 14), (474, start_y + 14)], fill=COLOR_WHITE)
            draw.rectangle([(460, start_y + 14), (472, start_y + 26)], fill=COLOR_WHITE)
        elif label == "PLAYER PLACED COUNTRY":
            # Simple flag
            draw.line([(458, start_y + 6), (458, start_y + 26)], fill=COLOR_WHITE, width=2)
            draw.polygon([(458, start_y + 6), (474, start_y + 12), (458, start_y + 18)], fill=COLOR_WHITE)
        else:
            # Calendar grid box
            draw.rectangle([(460, start_y + 8), (472, start_y + 24)], outline=COLOR_WHITE, width=2)
            draw.line([(460, start_y + 13), (472, start_y + 13)], fill=COLOR_WHITE, width=1)
            
        # Draw specifications layout text
        label_text = f"{label:<25} :   {val.upper()}"
        draw.text((505, start_y + 8), label_text, fill=COLOR_TEXT, font=font_bold)
        
        # Bottom divider border line
        draw.line([(450, start_y + 38), (920, start_y + 38)], fill=(241, 245, 249), width=1)
        
        start_y += 46
        
    # Save composite image file
    im.save(output_path)
    print(f"Successfully generated profile card at: {output_path}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Generate Cricket Player Profile Banner")
    parser.add_argument("--photo", required=True, help="Input player cut-out photo path")
    parser.add_argument("--name", default="Harshil Doshi", help="Player Full Name")
    parser.add_argument("--batting", default="Left Hand Batter", help="Player Batting Style")
    parser.add_argument("--bowling", default="Left Arm Fast Bowler", help="Player Bowling Style")
    parser.add_argument("--nationality", default="Indian", help="Player Nationality")
    parser.add_argument("--club", default="Bay of Plenty Indian Sports Club", help="Placed Club/Academy")
    parser.add_argument("--country", default="New Zealand", help="Placed Country")
    parser.add_argument("--season", default="2026-27", help="Placement Season Years")
    parser.add_argument("--output", default="player_profile_card.jpg", help="Output generated file name")
    
    args = parser.parse_args()
    generate_card(
        args.photo, args.name, args.batting, args.bowling, 
        args.nationality, args.club, args.country, args.season, args.output
    )
