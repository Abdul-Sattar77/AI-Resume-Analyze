// lib/pdfParser.ts
export async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    // Dynamic require for Turbopack compatibility
    const pdf = require('pdf-parse/lib/pdf-parse.js');
    const data = await pdf(buffer);
    
    if (!data || !data.text) {
      throw new Error("No text content found in PDF");
    }
    
    return data.text.trim();
  } catch (error: any) {
    console.error("PDF Extension Error:", error.message);
    throw new Error("Failed to read PDF file.");
  }
}