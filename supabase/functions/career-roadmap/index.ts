import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, profileData, profileId, userId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    if (action === "recommend") {
      const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_API_KEY}` },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: `You are a career counselor for tech students. Based on the student profile, recommend the top 3 most suitable career paths. Return ONLY valid JSON:
{
  "recommendations": [
    {
      "title": "Software Developer",
      "match_percentage": 85,
      "icon": "code",
      "explanation": "Why this career suits them",
      "key_skills": ["skill1", "skill2"],
      "salary_range": "$70k-$120k",
      "growth": "High"
    }
  ]
}
Use these icon names only: code, database, globe, cloud, bar-chart, shield, cpu, smartphone, brain, layers` },
            { role: "user", content: `Student Profile:\nSkills: ${profileData.programming_skills?.join(", ")}\nTechnical: ${profileData.technical_skills?.join(", ")}\nCGPA: ${profileData.cgpa}\nDSA Score: ${profileData.dsa_score}\nAptitude: ${profileData.aptitude_score}\nProjects: ${profileData.num_projects}\nInternships: ${profileData.internship_experience}\nCommunication: ${profileData.communication_rating}/10\nQuiz Scores: ${JSON.stringify(profileData.quiz_scores || [])}\nCoding Score: ${profileData.coding_score || "N/A"}` },
          ],
          temperature: 0.4,
          max_tokens: 2000,
        }),
      });
      if (!aiRes.ok) {
        if (aiRes.status === 429) return new Response(JSON.stringify({ error: "Rate limited." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (aiRes.status === 402) return new Response(JSON.stringify({ error: "Payment required." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        throw new Error(`AI error: ${aiRes.status}`);
      }
      const data = await aiRes.json();
      const content = data.choices?.[0]?.message?.content || "{}";
      let parsed;
      try { const m = content.match(/\{[\s\S]*\}/); parsed = JSON.parse(m ? m[0] : content); } catch { parsed = { recommendations: [] }; }
      return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "roadmap") {
      const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_API_KEY}` },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: `You are a learning path advisor for tech students. Based on their profile and skill gaps, generate a personalized step-by-step learning roadmap. Return ONLY valid JSON:
{
  "roadmap": [
    {
      "step": 1,
      "title": "Learn Data Structures",
      "description": "Master arrays, linked lists, trees, and graphs",
      "topics": ["Arrays", "Linked Lists", "Trees"],
      "resources": [{"name": "LeetCode", "url": "https://leetcode.com", "type": "practice"}, {"name": "MIT OCW", "url": "https://ocw.mit.edu", "type": "course"}],
      "timeline": "2-3 weeks",
      "priority": "high"
    }
  ],
  "estimated_total_time": "3-6 months",
  "career_goal": "Software Developer"
}
Generate 5-8 steps.` },
            { role: "user", content: `Student Profile:\nSkills: ${profileData.programming_skills?.join(", ")}\nTechnical: ${profileData.technical_skills?.join(", ")}\nCGPA: ${profileData.cgpa}\nDSA: ${profileData.dsa_score}%\nAptitude: ${profileData.aptitude_score}%\nProjects: ${profileData.num_projects}\nInternships: ${profileData.internship_experience}\nCommunication: ${profileData.communication_rating}/10\nCareer Goal: ${profileData.career_goal || "Software Developer"}` },
          ],
          temperature: 0.5,
          max_tokens: 3000,
        }),
      });
      if (!aiRes.ok) {
        if (aiRes.status === 429) return new Response(JSON.stringify({ error: "Rate limited." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        throw new Error(`AI error: ${aiRes.status}`);
      }
      const data = await aiRes.json();
      const content = data.choices?.[0]?.message?.content || "{}";
      let parsed;
      try { const m = content.match(/\{[\s\S]*\}/); parsed = JSON.parse(m ? m[0] : content); } catch { parsed = { roadmap: [], estimated_total_time: "Unknown" }; }

      // Save
      const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
      await supabase.from("career_recommendations").insert({
        profile_id: profileId || null,
        user_id: userId || null,
        recommendations: profileData.recommendations || [],
        roadmap: parsed.roadmap || [],
      });

      return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
