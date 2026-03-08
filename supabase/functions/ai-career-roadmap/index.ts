const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { career } = await req.json();
    if (!career) throw new Error("Career field is required");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
            content: `You are an expert career advisor and learning path designer. Given a career or job title, generate a comprehensive step-by-step learning roadmap that covers all the skills, knowledge, and experience needed to succeed in that career. Return ONLY valid JSON:
{
  "roadmap": [
    {
      "step": 1,
      "title": "Step Title",
      "description": "What to learn and why it matters",
      "topics": ["Topic1", "Topic2", "Topic3"],
      "resources": [{"name": "Resource Name", "url": "https://example.com", "type": "course"}],
      "timeline": "2-3 weeks",
      "priority": "high"
    }
  ],
  "estimated_total_time": "6-12 months",
  "career_goal": "The Career Title"
}
Generate 6-10 detailed steps covering fundamentals to advanced topics. Include real resource URLs (Coursera, Udemy, YouTube, FreeCodeCamp, official docs, etc). Priority must be "high", "medium", or "low".`
          },
          {
            role: "user",
            content: `Generate a complete learning roadmap for becoming a: ${career}`
          },
        ],
        temperature: 0.5,
        max_tokens: 4000,
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiRes.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI error: ${aiRes.status}`);
    }

    const data = await aiRes.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    let parsed;
    try {
      const m = content.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(m ? m[0] : content);
    } catch {
      parsed = { roadmap: [], estimated_total_time: "Unknown", career_goal: career };
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
