import { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { templateUrl, slug, ...formData } = req.body;

  if (!templateUrl) return res.status(400).json({ error: "Missing template URL." });

  try {
    const templateRes = await fetch(templateUrl);
    const textContent = await templateRes.text();

    // Replace placeholders like {{fullName}} with actual values
    let filledText = textContent;
    for (const [key, value] of Object.entries(formData)) {
      const placeholder = `{{${key}}}`;
      filledText = filledText.replaceAll(placeholder, String(value));
    }

    // Generate the PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { height } = page.getSize();

    const lines = filledText.split("\n");
    let y = height - 50;

    for (const line of lines) {
      page.drawText(line, { x: 50, y, size: 12, font, color: rgb(0, 0, 0) });
      y -= 20;
    }

    const pdfBytes = await pdfDoc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${slug}-customized.pdf`);
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
}
