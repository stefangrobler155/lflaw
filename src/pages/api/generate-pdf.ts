import { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine.length > 0 ? currentLine + " " + word : word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);

    if (testWidth < maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return lines;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { templateUrl, slug, fontFamily = "Helvetica", ...formData } = req.body;

  if (!templateUrl || !slug) {
    return res.status(400).json({ error: "Missing required data." });
  }

  try {
    const templateRes = await fetch(templateUrl);
    if (!templateRes.ok) {
      throw new Error(`Template fetch failed: ${templateRes.status} ${templateRes.statusText}`);
    }

    const textContent = await templateRes.text();

    let filledText = textContent;
    for (const [key, value] of Object.entries(formData)) {
      const placeholder = `{{${key}}}`;
      filledText = filledText.replaceAll(placeholder, String(value));
    }

    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    const margin = 50;
    const usableWidth = width - margin * 2;
    const fontSize = 12;
    const lineHeight = 20;

    // Font selection
    const fontMap: Record<string, string> = {
      helvetica: StandardFonts.Helvetica,
      times: StandardFonts.TimesRoman,
      courier: StandardFonts.Courier,
    };

    const selectedFont = fontMap[fontFamily.toLowerCase()] || StandardFonts.Helvetica;
    const font = await pdfDoc.embedFont(selectedFont);

    // Render paragraph-by-paragraph with word wrapping
    const paragraphs = filledText.split("\n");
    let y = height - margin;

    for (const paragraph of paragraphs) {
      const wrappedLines = wrapText(paragraph.trim(), font, fontSize, usableWidth);

      for (const line of wrappedLines) {
        if (y < margin + lineHeight) {
          page = pdfDoc.addPage();
          y = height - margin;
        }

        page.drawText(line, {
          x: margin,
          y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });

        y -= lineHeight;
      }

      y -= lineHeight; // Extra space between paragraphs
    }

    const pdfBytes = await pdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${slug}-contract.pdf`);
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
}
