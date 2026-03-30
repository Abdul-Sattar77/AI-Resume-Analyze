import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@/lib/gemini";
import * as pdfParse from "pdf-parse";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const jobDescription = formData.get("jobDescription") as string;

    if (!file || !jobDescription) {
      return NextResponse.json({ error: "File or JD missing" }, { status: 400 });
    }

    // Extract text from PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfData = await pdfParse(buffer);
    const resumeText = pdfData.text;

    console.log("🚀 Sending to OpenRouter...");
    const responseText = await analyzeResume(resumeText, jobDescription);

    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    return NextResponse.json(JSON.parse(cleanJson));

  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Analysis failed", message: error.message }, { status: 500 });
  }
}