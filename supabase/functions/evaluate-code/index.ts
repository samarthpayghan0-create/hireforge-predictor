import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { code, language, problemTitle, problemDescription, sampleInput, sampleOutput, testCases, problemId, profileId, userId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_API_KEY}` },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: `You are a code evaluator. Analyze the submitted ${language} code for the given problem. Check correctness against test cases, evaluate code quality, and provide feedback. Return ONLY valid JSON:
{
  "is_correct": true/false,
  "score": 0-100,
  "test_results": [{"input": "...", "expected": "...", "actual": "...", "passed": true/false}],
  "execution_time_estimate_ms": number,
  "feedback": "detailed feedback",
  "suggestions": ["suggestion 1", "suggestion 2"],
  "complexity": {"time": "O(n)", "space": "O(1)"}
}` },
          { role: "user", content: `Problem: ${problemTitle}\n${problemDescription}\n\nSample Input: ${sampleInput}\nSample Output: ${sampleOutput}\n\nTest Cases: ${JSON.stringify(testCases)}\n\nSubmitted ${language} code:\n\`\`\`${language}\n${code}\n\`\`\`` },
        ],
        temperature: 0.2,
        max_tokens: 2000,
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429) return new Response(JSON.stringify({ error: "Rate limited, try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (aiRes.status === 402) return new Response(JSON.stringify({ error: "Payment required." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI error: ${aiRes.status}`);
    }

    const data = await aiRes.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    let parsed;
    try { const m = content.match(/\{[\s\S]*\}/); parsed = JSON.parse(m ? m[0] : content); } catch { parsed = { is_correct: false, score: 0, feedback: "Could not evaluate code.", suggestions: [], test_results: [] }; }

    // Save submission
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    await supabase.from("coding_submissions").insert({
      problem_id: problemId || null,
      profile_id: profileId || null,
      user_id: userId || null,
      language,
      code,
      is_correct: parsed.is_correct || false,
      execution_time_ms: parsed.execution_time_estimate_ms || 0,
      ai_feedback: parsed.feedback || "",
      score: parsed.score || 0,
    });

    return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
