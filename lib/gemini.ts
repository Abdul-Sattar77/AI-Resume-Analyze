const ANALYSIS_PROMPT = `Analyze the Resume against the JD. 
Return ONLY a valid JSON object with no extra text:
{
  "match_percentage": number,
  "missing_skills": string[],
  "suggestions": string[],
  "summary": string
}`;

export async function analyzeResume(base64PDF: string, jobDescription: string) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openrouter/free",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `${ANALYSIS_PROMPT}\n\nJOB DESCRIPTION:\n${jobDescription}`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:application/pdf;base64,${base64PDF}`
              }
            }
          ]
        }
      ]
    })
  });

  const data = await response.json();

  // Log full response so we can debug if it fails
  console.log("OpenRouter raw response:", JSON.stringify(data, null, 2));

  if (!response.ok || !data.choices) {
    throw new Error(`OpenRouter error: ${JSON.stringify(data)}`);
  }

  return data.choices[0].message.content;
}