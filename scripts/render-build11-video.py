#!/usr/bin/env python3
"""Independent MAKHEX English workflow simulation.
No third-party X footage or original project images are copied.
This video is NOT a recording of hardware or working firmware.
Dependencies: pillow, ffmpeg. Output: self-hosted MP4, still JPGs, and WebVTT.
"""
import os
import pathlib
import subprocess
import tempfile
from PIL import Image, ImageDraw, ImageFont

W, H = 1280, 720
OUT = pathlib.Path("public/demo")
OUT.mkdir(parents=True, exist_ok=True)
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
def font(size, bold=False):
    return ImageFont.truetype(BOLD if bold else FONT, size)

SCENES = [
  ("01 / PHOTO CAPTURE", "Frame the question.", "Include the whole equation and answer area.", "capture",
   ["Keep the problem clearly visible", "Check lighting and focus", "Photograph non-sensitive examples"]),
  ("02 / QUESTION PICKER", "Choose what to solve.", "Verify the recognized item before sending it.", "picker",
   ["1. Solve 2x + 6 = 14", "2. Factor x² + 5x + 6", "Confirm your choice"]),
  ("03 / AI EXPLANATION", "Review each step.", "Understand how a sample equation is solved.", "explain",
   ["2x + 6 = 14", "2x = 8", "x = 4"]),
  ("04 / VOICE FOLLOW-UP", "Ask why it works.", "Review the transcript before submitting it.", "voice",
   ["Why subtract 6 first?", "Confirm recognized speech", "Keep the same question context"]),
  ("05 / BUILD THE HARDWARE", "Build your own.", "Confirm the exact camera, core and software.", "hardware",
   ["ESP32-S31 touchscreen main unit", "Dedicated H2 camera module", "USB-C data and your Wi-Fi"])
]
def text(draw,xy,val,fill,size=24,bold=False,anchor=None):
    draw.text(xy,val,fill=fill,font=font(size,bold),anchor=anchor)
def rr(draw,xy,rad,fill,outline=None,width=1):
    draw.rounded_rectangle(xy,radius=rad,fill=fill,outline=outline,width=width)
def make(scene,index):
    stage,title,subtitle,mode,items=scene
    im=Image.new("RGB",(W,H),(246,240,230))
    d=ImageDraw.Draw(im)
    d.rectangle((0,644,W,H),fill=(40,65,59))
    d.line([(0,98),(W,98)],fill=(219,207,188),width=2)
    text(d,(77,56),"MAKHEX  /  BUILD 11",(48,76,64),22,True)
    text(d,(1186,56),"ENGLISH CONCEPT WALKTHROUGH",(141,112,85),17,False,"ra")
    rr(d,(97,119,562,588),45,(215,218,213),outline=(158,169,162),width=10)
    rr(d,(120,145,540,552),23,(31,54,57))
    text(d,(647,179),stage,(173,99,58),19,True)
    text(d,(647,260),title,(39,64,52),41,True)
    text(d,(647,313),subtitle,(94,105,99),20,False)
    for n,line in enumerate(items):
        d.ellipse((650,376+n*51,667,393+n*51),fill=(231,142,77))
        text(d,(682,375+n*51),line,(52,69,62),20,False)
    d.rounded_rectangle((111,603,546,612),radius=4,fill=(221,207,182))
    d.rounded_rectangle((111,603,111+int(435*(index+1)/len(SCENES)),612),radius=4,fill=(225,124,73))
    text(d,(74,685),"CONCEPT SIMULATION  •  NOT ACTUAL DEVICE FOOTAGE",(239,225,203),17,True)
    text(d,(1194,685),f"{index+1} / {len(SCENES)}",(186,210,195),16,False,"ra")
    if mode=="capture":
        rr(d,(154,186,501,483),12,(68,99,96))
        # Focus brackets
        for points in [[(173,240),(173,205),(212,205)],[(445,205),(484,205),(484,240)],[(173,423),(173,459),(212,459)],[(445,459),(484,459),(484,423)]]:
            d.line(points,fill=(255,183,114),width=6,joint="curve")
        text(d,(326,312),"2x + 6 = 14",(255,250,238),36,True,"mm")
        d.ellipse((310,433,344,467),outline=(249,252,245),width=5)
    if mode=="picker":
        text(d,(156,202),"RECOGNIZED QUESTIONS",(171,216,192),18,True)
        rr(d,(153,230,508,319),12,(63,110,89),outline=(186,225,201),width=2)
        text(d,(170,280),"1) 2x + 6 = 14",(254,249,236),23,True,"lm")
        rr(d,(153,336,508,426),12,(46,72,73))
        text(d,(169,385),"2) Factor x² + 5x + 6",(229,235,230),19,False,"lm")
    if mode=="explain":
        text(d,(154,213),"STEP 1 / START",(167,220,194),19,True)
        text(d,(154,265),"2x + 6 = 14",(246,245,231),33,True)
        text(d,(154,321),"Subtract 6 on both sides",(216,229,218),18,False)
        text(d,(154,373),"2x = 8",(248,237,215),32,True)
        text(d,(154,426),"Divide by 2 -> x = 4",(255,171,116),22,True)
    if mode=="voice":
        text(d,(156,208),"VOICE FOLLOW-UP",(171,220,194),20,True)
        rr(d,(151,234,508,364),14,(44,75,76))
        text(d,(175,289),"Why subtract 6 first?",(242,245,228),20,True)
        text(d,(175,331),"Review recognized text",(205,222,209),16,False)
        rr(d,(218,387,436,440),23,(236,152,101))
        text(d,(325,414),"CONFIRM",(35,56,51),19,True,"mm")
    if mode=="hardware":
        d.ellipse((181,188,484,495),fill=(57,85,78),outline=(107,133,112),width=7)
        rr(d,(242,232,418,420),17,(26,38,43),outline=(214,218,209),width=10)
        text(d,(330,287),"ESP32-S31",(209,231,219),15,False,"mm")
        text(d,(330,350),"AI",(255,244,220),43,True,"mm")
        d.ellipse((399,184,481,266),fill=(232,139,83),outline=(245,218,177),width=8)
        d.ellipse((429,214,452,237),fill=(71,93,100))
    return im

with tempfile.TemporaryDirectory(prefix="makhex-build11-") as tmp:
    refs=[]
    for i,scene in enumerate(SCENES):
        frame=pathlib.Path(tmp)/f"frame-{i+1:02d}.jpg"
        make(scene,i).save(frame,"JPEG",quality=89,optimize=True)
        refs.append(frame)
        if i<3:
            (OUT/f"build11-scene-{i+1:02d}.jpg").write_bytes(frame.read_bytes())
        if i==0:
            (OUT/"build11-en-poster.jpg").write_bytes(frame.read_bytes())
    concat=pathlib.Path(tmp)/"frames.txt"
    # Fixed 3.2-second scenes. Last frame holds the final duration.
    concat.write_text("".join(f"file '{p}'\nduration 3.2\n" for p in refs)+f"file '{refs[-1]}'\n")
    target=OUT/"build11-en-concept.mp4"
    args=["ffmpeg","-hide_banner","-loglevel","error","-y","-f","concat","-safe","0","-i",str(concat),
          "-vf","fps=24,format=yuv420p","-c:v","libx264","-preset","veryfast",
          "-crf","26","-movflags","+faststart","-an",str(target)]
    subprocess.run(args,check=True,timeout=110)
    (OUT/"build11-en.vtt").write_text("""WEBVTT

00:00:00.000 --> 00:00:03.200
Frame a sample math question in the camera preview.

00:00:03.200 --> 00:00:06.400
Review the recognized questions and select one.

00:00:06.400 --> 00:00:09.600
Read the steps of a sample explanation.

00:00:09.600 --> 00:00:12.800
Review a spoken follow-up before submitting.

00:00:12.800 --> 00:00:16.000
Confirm the core unit, H2 camera and data cable.
""",encoding="utf-8")
    assert 5000<target.stat().st_size<20000000,target.stat().st_size
    print("MAKHEX INDEPENDENT VIDEO PASS",target.stat().st_size,"bytes; 5 slides, three stills, subtitles")
