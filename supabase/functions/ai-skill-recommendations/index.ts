import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { profile, quizScores, commScore, placementProb, gaps } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const profileSummary = `
Student: ${profile.name}
CGPA: ${profile.cgpa}/10
DSA Score: ${profile.dsa_score}%
Aptitude Score: ${profile.aptitude_score}%
Communication: ${commScore}%
Projects: ${profile.num_projects}
Internships: ${profile.internship_experience}
Programming Skills: ${(profile.programming_skills || []).join(", ")}
Technical Skills: ${(profile.technical_skills || []).join(", ")}
Placement Probability: ${placementProb}%
Quiz Scores: ${(quizScores || []).map((q: any) => `${q.category}: ${q.score}/${q.total_questions}`).join(", ") || "None taken"}
Identified Gaps: ${(gaps || []).map((g: any) => `${g.skill} (${g.severity})`).join(", ") || "None"}
    `.trim();

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an expert career advisor for engineering students preparing for placements at top tech companies (Google, Amazon, Microsoft, Meta, Apple). Analyze the student's profile and provide highly personalized, actionable skill recommendations.

Return ONLY valid JSON with this structure:
{
  "summary": "2-3 sentence personalized assessment",
  "top_skills_to_learn": [
    {
      "skill": "Skill name",
      "why": "Why this skill matters for their profile",
      "priority": "critical" | "high" | "medium",
      "time_to_learn": "e.g. 2-4 weeks",
      "resources": [
        { "name": "Resource name", "type": "course" | "book" | "platform" | "project", "url": "optional URL" }
      ],
      "action_steps": ["Step 1", "Step 2", "Step 3"]
    }
  ],
  "quick_wins": ["Quick actionable tip 1", "Quick actionable tip 2", "Quick actionable tip 3"],
  "thirty_day_plan": {
    "week1": "Focus area and tasks",
    "week2": "Focus area and tasks", 
    "week3": "Focus area and tasks",
    "week4": "Focus area and tasks"
  },
  "target_companies": ["Company 1", "Company 2", "Company 3"],
  "estimated_improvement": "How much placement probability could improve with these recommendations"
}`
          },
          {
            role: "user",
            content: `Analyze this student's profile and provide personalized skill recommendations:\n\n${profileSummary}`
          }
        ],
        temperature: 0.4,
        max_tokens: 3000,
      }),
    });

    if (!res.ok) {
      if (res.status === 429) return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (res.status === 402) return new Response(JSON.stringify({ error: "Payment required." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI error: ${res.status}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    let parsed;
    try {
      const m = content.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(m ? m[0] : content);
    } catch {
      parsed = { summary: "Could not generate recommendations. Please try again.", top_skills_to_learn: [], quick_wins: [], thirty_day_plan: {}, target_companies: [], estimated_improvement: "" };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
