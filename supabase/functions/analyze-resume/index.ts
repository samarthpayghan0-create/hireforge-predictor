import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const INDUSTRY_SKILLS = [
  "Python", "Java", "C++", "C", "JavaScript", "TypeScript", "React", "Angular", "Vue.js",
  "Node.js", "SQL", "MongoDB", "Machine Learning", "Deep Learning", "Cloud Computing",
  "AWS", "Azure", "Docker", "Kubernetes", "DevOps", "Git", "GitHub", "Linux", "REST API",
  "GraphQL", "Django", "Flask", "Spring Boot", "Ruby", "Go", "Rust", "PHP", "Swift", "Kotlin",
  "Flutter", "React Native", "TensorFlow", "PyTorch", "Pandas", "NumPy", "Data Structures",
  "Algorithms", "OOP", "DBMS", "Operating Systems", "Computer Networks", "HTML", "CSS",
  "Tailwind CSS", "Bootstrap", "Firebase", "PostgreSQL", "MySQL", "Redis", "Kafka",
  "Microservices", "CI/CD", "Agile", "Scrum", "JIRA", "Figma", "Power BI", "Tableau",
  "Excel", "R", "Scala", "Hadoop", "Spark", "Data Science", "NLP", "Computer Vision",
  "Cybersecurity", "Blockchain", "IoT", "Embedded Systems", "MATLAB", "Assembly",
  "Selenium", "Jest", "JUnit", "Postman", "Swagger", "OAuth", "JWT"
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, profileId, userId, resumeUrl } = await req.json();

    if (!resumeText || resumeText.trim().length < 50) {
      return new Response(JSON.stringify({ error: "Resume text too short or empty" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
            content: `You are an expert resume analyzer for tech/engineering students. Analyze the resume text and extract structured information. Return ONLY valid JSON with this exact structure:
{
  "detected_skills": ["skill1", "skill2"],
  "education": ["degree/institution details"],
  "projects": ["project name - brief description"],
  "certifications": ["cert name"],
  "work_experience": ["role at company - duration"],
  "keywords_found": ["keyword1", "keyword2"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}

Be thorough in extracting skills - look for programming languages, frameworks, tools, methodologies. For suggestions, provide actionable advice to improve the resume.`,
          },
          {
            role: "user",
            content: `Analyze this resume:\n\n${resumeText.substring(0, 8000)}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Parse AI response
    let parsed;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch {
      parsed = {
        detected_skills: [],
        education: [],
        projects: [],
        certifications: [],
        work_experience: [],
        keywords_found: [],
        suggestions: ["Unable to parse resume. Please ensure the PDF has readable text."],
      };
    }

    const detectedSkills: string[] = parsed.detected_skills || [];
    const education: string[] = parsed.education || [];
    const projects: string[] = parsed.projects || [];
    const certifications: string[] = parsed.certifications || [];
    const workExperience: string[] = parsed.work_experience || [];
    const suggestions: string[] = parsed.suggestions || [];

    // Match against industry skills (case-insensitive)
    const matchedIndustry = INDUSTRY_SKILLS.filter((s) =>
      detectedSkills.some((d) => d.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(d.toLowerCase())) ||
      resumeText.toLowerCase().includes(s.toLowerCase())
    );
    const missingSkills = INDUSTRY_SKILLS.filter(
      (s) => !matchedIndustry.some((m) => m.toLowerCase() === s.toLowerCase())
    ).slice(0, 15); // Top 15 missing

    // Calculate scores
    const skillsScore = Math.min(100, Math.round((matchedIndustry.length / 20) * 100));
    const projectsScore = Math.min(100, projects.length * 20);
    const experienceScore = Math.min(100, workExperience.length * 30 + certifications.length * 15);
    const keywordsScore = Math.min(100, Math.round(((parsed.keywords_found?.length || 0) / 10) * 100));

    const resumeScore = Math.round(
      skillsScore * 0.35 + projectsScore * 0.25 + experienceScore * 0.25 + keywordsScore * 0.15
    );

    // Store in database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase.from("resume_analyses").insert({
      profile_id: profileId || null,
      user_id: userId || null,
      resume_url: resumeUrl || null,
      resume_score: resumeScore,
      detected_skills: matchedIndustry,
      missing_skills: missingSkills,
      education,
      projects,
      certifications,
      work_experience: workExperience,
      suggestions,
      skills_score: skillsScore,
      projects_score: projectsScore,
      experience_score: experienceScore,
      keywords_score: keywordsScore,
      raw_text: resumeText.substring(0, 5000),
    }).select().single();

    if (error) throw error;

    return new Response(JSON.stringify({
      id: data.id,
      resume_score: resumeScore,
      skills_score: skillsScore,
      projects_score: projectsScore,
      experience_score: experienceScore,
      keywords_score: keywordsScore,
      detected_skills: matchedIndustry,
      missing_skills: missingSkills,
      education,
      projects,
      certifications,
      work_experience: workExperience,
      suggestions,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
