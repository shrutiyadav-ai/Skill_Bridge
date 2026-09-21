import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, studentName, targetRole, readiness, strongSkills, gaps } = body;

    const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;

    if (apiKey && apiKey !== "your_gemini_api_key") {
      try {
        const prompt = `You are the SkillBridge AI Career Advisor for university students.
Student: ${studentName || "Student"}
Target Career Role: ${targetRole || "Software / Tech Professional"}
Current Career Readiness: ${readiness || 0}%
Verified Strong Skills: ${(strongSkills || []).join(", ") || "None yet assessed"}
Identified Skill Gaps: ${(gaps || []).join(", ") || "None identified"}

User question: "${question}"

Provide a concise, practical, and highly specific 2-3 sentence answer based strictly on their actual verified skill vector and industry standards. Do not invent fictitious numbers or companies.`;

        if (apiKey.startsWith("gsk_")) {
          // Call Groq Cloud API with production model
          const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages: [
                {
                  role: "system",
                  content: "You are the SkillBridge AI Career Advisor. Provide concise, practical, and direct advice in 2-3 sentences based strictly on the student's actual competencies.",
                },
                { role: "user", content: prompt },
              ],
              max_tokens: 250,
              temperature: 0.5,
            }),
          });

          if (groqRes.ok) {
            const data = await groqRes.json();
            const text = data.choices?.[0]?.message?.content;
            if (text && text.trim()) {
              return NextResponse.json({ answer: text.trim() });
            }
          }
        } else {
          // Call Google Gemini API
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
              }),
            }
          );

          if (geminiRes.ok) {
            const data = await geminiRes.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text && text.trim()) {
              return NextResponse.json({ answer: text.trim() });
            }
          }
        }
      } catch (apiErr) {
        console.warn("AI API request failed, using structured evaluation fallback:", apiErr);
      }
    }

    // Dynamic fallback based STRICTLY on the student's actual assessed data
    const actualGaps = Array.isArray(gaps) && gaps.length > 0 ? gaps : [];
    const actualStrong = Array.isArray(strongSkills) && strongSkills.length > 0 ? strongSkills : [];
    const roleTitle = targetRole || "your target role";
    const readinessScore = typeof readiness === "number" ? `${readiness}%` : "evaluated";

    let answer = "";
    if (actualGaps.length > 0) {
      answer = `Based on your assessment for ${roleTitle} (readiness: ${readinessScore}), your priority skill gaps to address are ${actualGaps.slice(0, 3).join(", ")}. We recommend focusing on targeted coursework in these areas to bridge your readiness deficit.`;
      if (actualStrong.length > 0) {
        answer += ` Your verified strengths in ${actualStrong.slice(0, 2).join(" and ")} provide a solid foundation.`;
      }
    } else if (actualStrong.length > 0) {
      answer = `Your profile demonstrates strong proficiency in ${actualStrong.join(", ")} for ${roleTitle} (readiness: ${readinessScore}). You meet the current benchmark competencies for entry-level opportunities in this track.`;
    } else {
      answer = `To receive tailored career guidance for ${roleTitle}, please complete the domain skill assessment to diagnose your verified skills and gap priorities.`;
    }

    return NextResponse.json({ answer });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process career query" },
      { status: 500 }
    );
  }
}
