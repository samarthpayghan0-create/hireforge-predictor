import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, category, questions, answers, profileId, userId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    if (action === "generate") {
      const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_API_KEY}` },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: `Generate exactly 5 interview questions for a ${category || "mixed"} interview. Return ONLY a JSON array of objects with "question", "category" (HR/Technical/Behavioral), and "tip" fields.` },
            { role: "user", content: `Generate ${category || "mixed"} interview questions for a fresh graduate software engineering candidate.` },
          ],
          temperature: 0.8,
          max_tokens: 1500,
        }),
      });
      if (!aiRes.ok) {
        if (aiRes.status === 429) return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (aiRes.status === 402) return new Response(JSON.stringify({ error: "Payment required." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        throw new Error(`AI error: ${aiRes.status}`);
      }
      const data = await aiRes.json();
      const content = data.choices?.[0]?.message?.content || "[]";
      let parsed;
      try { const m = content.match(/\[[\s\S]*\]/); parsed = JSON.parse(m ? m[0] : content); } catch { parsed = []; }
      return new Response(JSON.stringify({ questions: parsed }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "evaluate") {
      const qaPairs = questions.map((q: any, i: number) => `Q${i+1}: ${q.question}\nA${i+1}: ${answers[i] || "(no answer)"}`).join("\n\n");
      const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_API_KEY}` },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: `You are an expert interview coach. Evaluate each answer for relevance (0-10), clarity (0-10), completeness (0-10). Provide specific feedback for each answer and an overall score out of 10. Return ONLY valid JSON:
{
  "per_question": [{"relevance": 8, "clarity": 7, "completeness": 6, "feedback": "specific feedback"}],
  "overall_score": 7.5,
  "overall_feedback": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "strengths": ["strength 1"],
  "improvements": ["improvement 1"]
}` },
            { role: "user", content: `Evaluate these interview answers:\n\n${qaPairs}` },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });
      if (!aiRes.ok) {
        if (aiRes.status === 429) return new Response(JSON.stringify({ error: "Rate limited." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        throw new Error(`AI error: ${aiRes.status}`);
      }
      const data = await aiRes.json();
      const content = data.choices?.[0]?.message?.content || "{}";
      let parsed;
      try { const m = content.match(/\{[\s\S]*\}/); parsed = JSON.parse(m ? m[0] : content); } catch { parsed = { overall_score: 5, per_question: [], overall_feedback: ["Could not analyze responses."], strengths: [], improvements: [] }; }

      // Save to DB
      const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
      await supabase.from("mock_interviews").insert({
        profile_id: profileId || null,
        user_id: userId || null,
        category: category || "mixed",
        questions,
        answers,
        scores: parsed.per_question || [],
        overall_score: parsed.overall_score || 0,
        feedback: parsed.overall_feedback || [],
      });

      return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
