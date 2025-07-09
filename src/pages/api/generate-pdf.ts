// src/pages/api/generate-pdf.ts

import { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end("Method not allowed");
  }

  try {
    const { fullName, companyName, email, notes } = req.body;

    // Load the blank template
    const templatePath = path.join(process.cwd(), "public/template/contract-template.pdf");
    const existingPdfBytes = fs.readFileSync(templatePath);

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const page = pdfDoc.getPages()[0];
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const fontSize = 12;

    // Draw data onto the PDF
    page.drawText(`Name: ${fullName}`, { x: 50, y: height - 100, size: fontSize, font, color: rgb(0, 0, 0) });
    page.drawText(`Company: ${companyName}`, { x: 50, y: height - 120, size: fontSize, font });
    page.drawText(`Email: ${email}`, { x: 50, y: height - 140, size: fontSize, font });

    // Handle multiline notes (optional)
    if (notes) {
    const lines = notes.split("\n");
    lines.forEach((line: string, i: number) => {
    page.drawText(line, {
        x: 50,
        y: height - 160 - i * 15,
        size: fontSize,
        font,
    });
    });

    }

    const pdfBytes = await pdfDoc.save();

    // Return as download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=nda-customized.pdf");
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
}
