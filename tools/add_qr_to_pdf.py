from io import BytesIO
from pathlib import Path

import qrcode
from pypdf import PdfReader, PdfWriter
from reportlab.lib.colors import HexColor, white
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "formulaire-adhesion.pdf"
OUTPUT = ROOT / "assets" / "formulaire-adhesion-avec-liens.pdf"
QR_TARGET = "https://nougrr.github.io/atelier-des-liens/linktree.html"


def main() -> None:
    reader = PdfReader(str(SOURCE))
    page = reader.pages[0]
    width = float(page.mediabox.width)
    height = float(page.mediabox.height)

    qr = qrcode.QRCode(version=None, error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=12, border=2)
    qr.add_data(QR_TARGET)
    qr.make(fit=True)
    qr_image = qr.make_image(fill_color="#17263d", back_color="white").convert("RGB")
    qr_buffer = BytesIO()
    qr_image.save(qr_buffer, format="PNG")
    qr_buffer.seek(0)

    # Lower-right corner leaves the form's labels and fields readable while making
    # the QR large enough to scan on a printed A4 page.
    box_x, box_y, box_size = width - 70, 2, 60
    overlay_buffer = BytesIO()
    overlay = canvas.Canvas(overlay_buffer, pagesize=(width, height))
    overlay.setFillColor(white)
    overlay.roundRect(box_x, box_y, box_size, box_size, 8, fill=1, stroke=0)
    overlay.setStrokeColor(HexColor("#d81b60"))
    overlay.setLineWidth(2)
    overlay.roundRect(box_x, box_y, box_size, box_size, 8, fill=0, stroke=1)
    overlay.drawImage(ImageReader(qr_buffer), box_x + 6, box_y + 6, width=48, height=48, preserveAspectRatio=True, mask="auto")
    overlay.save()
    overlay_buffer.seek(0)

    overlay_page = PdfReader(overlay_buffer).pages[0]
    page.merge_page(overlay_page)
    writer = PdfWriter()
    writer.add_page(page)
    with OUTPUT.open("wb") as stream:
        writer.write(stream)
    print(f"Created {OUTPUT}")


if __name__ == "__main__":
    main()
