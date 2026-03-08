import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, category, questions, answers, profileId, userId, speechMetrics } = await req.json();
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
      
      // Build speech metrics context for AI analysis
      let speechContext = "";
      if (speechMetrics && Array.isArray(speechMetrics) && speechMetrics.length > 0) {
        speechContext = `\n\nSPEECH ANALYSIS DATA (per answer):\n`;
        speechMetrics.forEach((m: any, i: number) => {
          speechContext += `Answer ${i+1}: ${m.wordCount} words in ${m.durationSec.toFixed(1)}s (${m.wpm.toFixed(0)} WPM), ${m.fillerCount} filler words [${m.fillers.join(", ")}], ${m.pauseCount} pauses, input method: ${m.inputMethod}\n`;
        });
      }

      const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_API_KEY}` },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: `You are an expert interview coach. Evaluate each answer for relevance (0-10), clarity (0-10), completeness (0-10). 

Also evaluate the candidate's COMMUNICATION STYLE based on the speech metrics data provided. Analyze:
- Speaking speed (ideal: 120-160 WPM; too fast >180, too slow <90)
- Filler word usage (um, uh, like, you know, basically, actually, so, right)
- Pause frequency (natural pauses are OK, excessive pauses indicate hesitation)
- Sentence structure and articulation from the transcript
- Confidence level inferred from speech patterns

Provide a communication_analysis object with scores 0-10 for each metric and personalized feedback.

Return ONLY valid JSON:
{
  "per_question": [{"relevance": 8, "clarity": 7, "completeness": 6, "feedback": "specific feedback"}],
  "overall_score": 7.5,
  "overall_feedback": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "strengths": ["strength 1"],
  "improvements": ["improvement 1"],
  "communication_analysis": {
    "overall_communication_score": 7.5,
    "speaking_speed_score": 7,
    "speaking_speed_wpm": 135,
    "speaking_speed_feedback": "Your speaking pace is well-balanced.",
    "clarity_score": 8,
    "clarity_feedback": "Clear pronunciation and articulation.",
    "confidence_score": 7,
    "confidence_feedback": "You sound fairly confident.",
    "filler_word_score": 6,
    "filler_word_count": 5,
    "filler_words_detected": ["um", "like"],
    "filler_feedback": "Try to reduce filler words.",
    "pause_score": 7,
    "pause_feedback": "Natural pausing pattern.",
    "sentence_structure_score": 7,
    "sentence_structure_feedback": "Good sentence structure overall.",
    "strengths": ["Clear pronunciation", "Good confidence"],
    "areas_to_improve": ["Reduce filler words", "Maintain steady speaking pace"],
    "tips": ["Practice with a timer", "Record yourself and listen back"]
  }
}` },
            { role: "user", content: `Evaluate these interview answers:\n\n${qaPairs}${speechContext}` },
          ],
          temperature: 0.3,
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
      try { const m = content.match(/\{[\s\S]*\}/); parsed = JSON.parse(m ? m[0] : content); } catch { parsed = { overall_score: 5, per_question: [], overall_feedback: ["Could not analyze responses."], strengths: [], improvements: [], communication_analysis: null }; }

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
        feedback: { 
          overall_feedback: parsed.overall_feedback || [],
          communication_analysis: parsed.communication_analysis || null,
          speech_metrics: speechMetrics || null,
        },
      });

      // Also save communication score to communication_scores table if we have analysis
      if (parsed.communication_analysis && profileId) {
        const commAnalysis = parsed.communication_analysis;
        await supabase.from("communication_scores").insert({
          profile_id: profileId,
          overall_score: Math.round(commAnalysis.overall_communication_score * 10),
          clarity_score: Math.round(commAnalysis.clarity_score * 10),
          fluency_score: Math.round(commAnalysis.speaking_speed_score * 10),
          confidence_score: Math.round(commAnalysis.confidence_score * 10),
          speaking_speed: commAnalysis.speaking_speed_wpm || 0,
          transcript: answers.join("\n\n---\n\n"),
        });
      }

      return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
