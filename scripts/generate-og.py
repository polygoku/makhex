"""Generate an original social-preview graphic for MAKHEX (requires Pillow)."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "og.png"
W,H = 1200,630
img = Image.new("RGB", (W,H), "#f6f1e8")
d = ImageDraw.Draw(img)
bg = "#f6f1e8"
green = "#20483d"
orange = "#c65d2c"
soft = "#e5e1d5"
muted = "#526157"
for x in range(0,W,46):
    d.line((x,0,x,H), fill="#ebe6dd", width=1)
for y in range(0,H,46):
    d.line((0,y,W,y), fill="#ebe6dd", width=1)
d.rounded_rectangle((37,36,1163,594), radius=28, fill=bg, outline="#cec7b7", width=3)
d.rounded_rectangle((776,82,1094,510), radius=26, fill="#e6ede3")
# Original stylized controller board (not a product photo).
d.rounded_rectangle((815,184,1051,408), radius=18, fill=green)
for y in range(204,396,25):
    d.rounded_rectangle((798,y,816,y+10),radius=3,fill=orange)
    d.rounded_rectangle((1050,y,1068,y+10),radius=3,fill=orange)
d.rounded_rectangle((864,234,1002,357),radius=10,fill="#102f28",outline="#79a08a",width=4)
d.rectangle((914,270,954,310),fill=orange)
for i in range(4):
    d.ellipse((829+i*45,197,836+i*45,204),fill="#8cb49c")
    d.ellipse((829+i*45,384,836+i*45,391),fill="#8cb49c")
def font(sz,bold=True):
    path=Path("C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf")
    return ImageFont.truetype(str(path),sz) if path.exists() else ImageFont.load_default()
d.text((87,72),"makhex.",font=font(87),fill=orange,stroke_width=0)
d.text((91,197),"ESP32 projects",font=font(65),fill=green)
d.text((91,280),"& DIY robotics",font=font(65),fill=green)
d.text((94,384),"From browser tab to workbench.",font=font(29,False),fill=muted)
d.line((94,465,716,465),fill="#d6c9b6",width=2)
d.text((95,490),"BUILD GUIDES   /   PARTS LISTS   /   MAKHEX CART",font=font(18),fill=green)
OUT.parent.mkdir(parents=True,exist_ok=True)
img.save(OUT,optimize=True)
print(str(OUT),OUT.stat().st_size,"bytes")
