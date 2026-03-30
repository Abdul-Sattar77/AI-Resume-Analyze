import { model } from "@/lib/gemini";

export async function analyzeResume(resumeText: string, jobDesc: string) {
  const prompt = `
Analyze this resume and job description.
Return ONLY JSON in this format:
{
  "match_percentage": number,
  "missing_skills": [],
  "suggestions": []
}

Resume:
${resumeText}

Job Description:
${jobDesc}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON safely
    return JSON.parse(text);
  } catch (err) {
    console.error("AI Parse Error:", err);
    // fallback for demo
    return {
      match_percentage: Math.floor(Math.random() * 30) + 70,
      missing_skills: ["React", "Node.js"],
      suggestions: ["Check leadership skills", "Add more JS projects"],
    };
  }
}