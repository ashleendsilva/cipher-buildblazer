from pathlib import Path
import base64

IMAGE_DIR = Path("public/images")

images = [
    "Raynell.JPG",
    "Nazmin.JPG",
    "Chaitra.JPG",
    "IMG_7350.JPG",
    "20260325_141046.jpg",
    "20260325_165226.jpg",
    "20260325_165255.jpg",
    "20260325_165737.jpg",
    "cipher1.JPG",
    "cipher2.JPG",
    "cipher3.JPG",
    "cipher4.JPG",
    "cipher-logo.webp"
]

for filename in images:
    image_path = IMAGE_DIR / filename

    if not image_path.exists():
        print(f"NOT FOUND: {filename}")
        continue

    extension = image_path.suffix.lower()

    if extension in [".jpg", ".jpeg"]:
        mime = "image/jpeg"
    elif extension == ".png":
        mime = "image/png"
    else:
        print(f"SKIPPED: {filename}")
        continue

    with open(image_path, "rb") as f:
        encoded = base64.b64encode(f.read()).decode("utf-8")

    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg"
xmlns:xlink="http://www.w3.org/1999/xlink"
viewBox="0 0 100 100"
preserveAspectRatio="xMidYMid slice">
<image
    width="100"
    height="100"
    preserveAspectRatio="xMidYMid slice"
    href="data:{mime};base64,{encoded}"
/>
</svg>'''

    output_path = image_path.with_suffix(".svg")

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(svg_content)

    print(f"CREATED: {output_path}")

print("\nDone!")