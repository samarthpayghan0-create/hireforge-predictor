import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // ===== GENERATE SOLUTION MODE =====
    if (body.mode === "generate-solution") {
      const { language, problemTitle, problemDescription, sampleInput, sampleOutput } = body;
      const solRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_API_KEY}` },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: `You are an expert programmer. Write a clean, well-commented solution in ${language} for the given coding problem. Return ONLY the code, no markdown fences, no explanation outside code comments.` },
            { role: "user", content: `Problem: ${problemTitle}\n${problemDescription}\n\nSample Input: ${sampleInput}\nExpected Output: ${sampleOutput}` },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });
      if (!solRes.ok) throw new Error("Failed to generate solution");
      const solData = await solRes.json();
      let solution = solData.choices?.[0]?.message?.content || "// No solution generated";
      solution = solution.replace(/^```[\w]*\n?/gm, "").replace(/```$/gm, "").trim();
      return new Response(JSON.stringify({ solution }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ===== EVALUATE CODE MODE =====
    const { code, language, problemTitle, problemDescription, sampleInput, sampleOutput, testCases, problemId, profileId, userId, username, difficulty, points } = body;

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

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // Save submission
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

    // Update leaderboard if correct and user is logged in
    if (parsed.is_correct && userId && username) {
      const earnedPoints = points || (difficulty === "hard" ? 30 : difficulty === "medium" ? 20 : 10);
      // Calculate bonus for fast solutions
      const timeBonus = parsed.execution_time_estimate_ms < 100 ? 5 : parsed.execution_time_estimate_ms < 500 ? 2 : 0;
      const totalEarned = earnedPoints + timeBonus;

      const { data: existing } = await supabase
        .from("coding_leaderboard")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (existing) {
        const diffKey = difficulty === "hard" ? "hard_solved" : difficulty === "medium" ? "medium_solved" : "easy_solved";
        const newSolved = (existing.problems_solved || 0) + 1;
        const newScore = (existing.total_score || 0) + totalEarned;

        // Count total submissions for success rate
        const { count: totalSubs } = await supabase
          .from("coding_submissions")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId);
        const { count: correctSubs } = await supabase
          .from("coding_submissions")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("is_correct", true);

        await supabase.from("coding_leaderboard").update({
          total_score: newScore,
          problems_solved: newSolved,
          [diffKey]: (existing[diffKey] || 0) + 1,
          preferred_language: language,
          success_rate: totalSubs ? Math.round(((correctSubs || 0) / totalSubs) * 100) : 0,
          updated_at: new Date().toISOString(),
        }).eq("user_id", userId);
      } else {
        await supabase.from("coding_leaderboard").insert({
          user_id: userId,
          profile_id: profileId || null,
          username,
          total_score: totalEarned,
          problems_solved: 1,
          easy_solved: difficulty === "easy" ? 1 : 0,
          medium_solved: difficulty === "medium" ? 1 : 0,
          hard_solved: difficulty === "hard" ? 1 : 0,
          preferred_language: language,
          success_rate: 100,
        });
      }

      parsed.points_earned = totalEarned;
      parsed.time_bonus = timeBonus;
    }

    return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
