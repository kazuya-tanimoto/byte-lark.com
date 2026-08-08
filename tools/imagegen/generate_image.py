import argparse
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image

BASE = Path(__file__).resolve().parent
load_dotenv(BASE.parents[1] / ".env")

parser = argparse.ArgumentParser(description="ブログカバー画像を Gemini API で生成する")
parser.add_argument("-n", "--count", type=int, default=3, help="生成枚数（最大10）")
parser.add_argument("-m", "--model", default="gemini-3.1-flash-image")
parser.add_argument("-p", "--prompt", type=Path, default=BASE / "prompt.txt")
parser.add_argument("-r", "--ref", type=Path, action="append", default=[],
                    help="参照画像。複数指定可")
parser.add_argument("-o", "--out", type=Path, default=BASE / "out")
parser.add_argument("--aspect", default="16:9")
parser.add_argument("--size", default="2K")
parser.add_argument("--no-crop", action="store_true",
                    help="40:21 クロップ版（*_cover.png）を出力しない")
args = parser.parse_args()

# 40:21 = BlogCard.astro の aspect-[40/21] に合わせる
COVER_RATIO = 40 / 21

if not args.prompt.exists():
    parser.error(f"プロンプトが見つかりません: {args.prompt}")
for r in args.ref:
    if not r.exists():
        parser.error(f"参照画像が見つかりません: {r}")

contents = [args.prompt.read_text(encoding="utf-8")]
contents += [Image.open(r) for r in args.ref]

count = min(args.count, 10)
tag = "pro" if "pro" in args.model else "flash"
stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
args.out.mkdir(parents=True, exist_ok=True)

client = genai.Client()


def crop_cover(src: Path) -> Path:
    img = Image.open(src)
    w, h = img.size
    target_h = int(w / COVER_RATIO)
    if target_h > h:
        raise ValueError(f"{src.name}: 高さ {h}px では {COVER_RATIO:.3f} にクロップできません")
    top = (h - target_h) // 2
    dst = src.with_name(src.stem + "_cover.png")
    img.crop((0, top, w, top + target_h)).save(dst)
    return dst


for i in range(count):
    resp = client.models.generate_content(
        model=args.model,
        contents=contents,
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE"],
            image_config=types.ImageConfig(
                aspect_ratio=args.aspect,
                image_size=args.size,
            ),
        ),
    )
    saved = False
    for part in resp.parts:
        if part.inline_data:
            path = args.out / f"{tag}_{stamp}_{i:02d}.png"
            part.as_image().save(path)
            print("saved:", path)
            saved = True
            if not args.no_crop:
                print("saved:", crop_cover(path))
    if not saved:
        print(f"[{i}] 画像が返りませんでした:", resp.parts)
