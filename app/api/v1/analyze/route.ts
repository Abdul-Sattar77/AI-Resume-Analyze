import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@/lib/gemini";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const jobDescription = formData.get("jobDescription") as string;

    if (!file || !jobDescription) {
      return NextResponse.json({ error: "File or JD missing" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    console.log("🚀 Sending PDF to OpenRouter...");
    const responseText = await analyzeResume(base64Data, jobDescription);

    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    return NextResponse.json(JSON.parse(cleanJson));

  } catch (error: any) {
    console.error("Detailed Server Error:", error);
    return NextResponse.json({ 
      error: "Analysis failed", 
      message: error.message 
    }, { status: 500 });
  }
}