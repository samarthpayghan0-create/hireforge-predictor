import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ─── ATS keyword bank (TCS / Infosys / Wipro / Accenture / product companies) ───
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
  "Selenium", "Jest", "JUnit", "Postman", "Swagger", "OAuth", "JWT",
  "SAP", "Salesforce", ".NET", "C#", "Jenkins", "Terraform", "Ansible",
  "Elasticsearch", "RabbitMQ", "gRPC", "WebSocket", "OAuth2", "OpenCV",
  "Scikit-learn", "Keras", "LSTM", "Transformer", "BERT", "GPT",
];

// Action verbs that ATS systems and recruiters value
const ACTION_VERBS = [
  "achieved", "administered", "analyzed", "architected", "automated",
  "built", "collaborated", "configured", "created", "debugged",
  "delivered", "deployed", "designed", "developed", "enhanced",
  "engineered", "established", "executed", "implemented", "improved",
  "increased", "integrated", "launched", "led", "maintained",
  "managed", "mentored", "migrated", "monitored", "optimized",
  "orchestrated", "overhauled", "planned", "programmed", "published",
  "reduced", "refactored", "resolved", "revamped", "scaled",
  "secured", "simplified", "spearheaded", "streamlined", "supervised",
  "tested", "trained", "transformed", "upgraded", "utilized",
];

// ─── Required resume sections (ATS parsers check for these headings) ───
const REQUIRED_SECTIONS = [
  { name: "Contact Information", patterns: ["email", "phone", "linkedin", "github", "@", "+91", "contact"] },
  { name: "Education", patterns: ["education", "university", "college", "bachelor", "master", "b.tech", "b.e", "m.tech", "m.e", "bsc", "msc", "degree", "cgpa", "gpa", "percentage"] },
  { name: "Skills", patterns: ["skills", "technical skills", "technologies", "proficiency", "competencies", "tools"] },
  { name: "Experience", patterns: ["experience", "work experience", "internship", "intern", "employment", "professional experience"] },
  { name: "Projects", patterns: ["projects", "personal projects", "academic projects", "key projects"] },
  { name: "Summary/Objective", patterns: ["summary", "objective", "profile", "about me", "career objective", "professional summary"] },
];

// ─── Utility helpers ───
function countOccurrences(text: string, word: string): number {
  const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
  return (text.match(regex) || []).length;
}

function hasQuantifiedResults(text: string): { count: number; examples: string[] } {
  // Matches patterns like "increased by 40%", "reduced 30%", "2x improvement", "$50K", "100+ users"
  const patterns = [
    /\b\d+\s*%/g,
    /\b\d+\s*x\b/gi,
    /\$\s*\d+[KkMm]?\b/g,
    /\b\d{2,}[\+]?\s*(users|customers|clients|requests|transactions|records|downloads|visits)/gi,
    /\b(increased|decreased|reduced|improved|grew|saved|cut|boosted|raised)\b[^.]{0,40}\b\d+/gi,
  ];
  const examples: string[] = [];
  let count = 0;
  for (const p of patterns) {
    const matches = text.match(p) || [];
    count += matches.length;
    examples.push(...matches.slice(0, 2));
  }
  return { count, examples: [...new Set(examples)].slice(0, 5) };
}

function detectSections(text: string): { found: string[]; missing: string[] } {
  const lower = text.toLowerCase();
  const found: string[] = [];
  const missing: string[] = [];
  for (const sec of REQUIRED_SECTIONS) {
    const detected = sec.patterns.some((p) => lower.includes(p));
    if (detected) found.push(sec.name);
    else missing.push(sec.name);
  }
  return { found, missing };
}

function countActionVerbs(text: string): { count: number; found: string[] } {
  const lower = text.toLowerCase();
  const found = ACTION_VERBS.filter((v) => lower.includes(v));
  return { count: found.length, found };
}

function estimateWordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function countBulletPoints(text: string): number {
  // Heuristic: count lines starting with •, -, *, ▪, ►, or numbered lists
  return (text.match(/(?:^|\n)\s*(?:[•\-\*▪►●◦‣⁃]|\d+[\.\)])\s/g) || []).length;
}

// ─── ATS Scoring Engine (aligned with TCS iON, Infosys Recruit, standard ATS) ───
function calculateATSScores(resumeText: string, aiParsed: any) {
  const text = resumeText;
  const lower = text.toLowerCase();
  const wordCount = estimateWordCount(text);

  // 1. SECTION COMPLETENESS (15% weight) — ATS parsers reject resumes missing key sections
  const sections = detectSections(text);
  const sectionScore = Math.round((sections.found.length / REQUIRED_SECTIONS.length) * 100);

  // 2. SKILLS MATCH (25% weight) — keyword matching against JD / industry skills
  const matchedIndustry = INDUSTRY_SKILLS.filter(
    (s) =>
      lower.includes(s.toLowerCase()) ||
      (aiParsed.detected_skills || []).some(
        (d: string) => d.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(d.toLowerCase())
      )
  );
  // Weighted: first 10 skills = high value, next 10 = diminishing returns
  const rawSkillRatio = matchedIndustry.length / 15; // 15 relevant skills = 100%
  const skillsScore = Math.min(100, Math.round(rawSkillRatio * 100));

  // 3. EXPERIENCE & IMPACT (20% weight) — looks for quantified achievements
  const quantified = hasQuantifiedResults(text);
  const workExp: string[] = aiParsed.work_experience || [];
  const certs: string[] = aiParsed.certifications || [];
  const expBase = Math.min(50, workExp.length * 15 + certs.length * 10);
  const impactBonus = Math.min(50, quantified.count * 12);
  const experienceScore = Math.min(100, expBase + impactBonus);

  // 4. PROJECTS (15% weight)
  const projects: string[] = aiParsed.projects || [];
  const projBase = Math.min(60, projects.length * 20);
  // Bonus for project descriptions that mention tech stack
  const projTechBonus = projects.filter((p: string) =>
    INDUSTRY_SKILLS.some((s) => p.toLowerCase().includes(s.toLowerCase()))
  ).length * 10;
  const projectsScore = Math.min(100, projBase + Math.min(40, projTechBonus));

  // 5. FORMATTING & ATS READABILITY (10% weight)
  const actionVerbs = countActionVerbs(text);
  const bulletCount = countBulletPoints(text);
  const hasEmail = /[\w.-]+@[\w.-]+\.\w{2,}/.test(text);
  const hasPhone = /(\+?\d[\d\s\-]{7,}\d)/.test(text);
  const hasLinkedIn = /linkedin/i.test(text);
  const hasGitHub = /github/i.test(text);

  let formatScore = 0;
  // Word count: ideal 300-800 for 1-2 pages
  if (wordCount >= 200 && wordCount <= 1000) formatScore += 20;
  else if (wordCount >= 100) formatScore += 10;
  // Action verbs (ATS parsers flag passive language)
  formatScore += Math.min(30, actionVerbs.count * 3);
  // Bullet points (structured content parses better)
  formatScore += Math.min(20, bulletCount * 2);
  // Contact info completeness
  if (hasEmail) formatScore += 8;
  if (hasPhone) formatScore += 7;
  if (hasLinkedIn) formatScore += 5;
  if (hasGitHub) formatScore += 5;
  // Cap at 100, floor at 5
  formatScore = Math.max(5, Math.min(100, formatScore));

  // 6. KEYWORDS & ATS DENSITY (15% weight)
  const keywordsFound: string[] = aiParsed.keywords_found || [];
  // Check keyword density: unique industry terms appearing in resume
  const uniqueKeywords = new Set([
    ...matchedIndustry.map((s) => s.toLowerCase()),
    ...keywordsFound.map((k: string) => k.toLowerCase()),
  ]);
  const keywordsScore = Math.min(100, Math.round((uniqueKeywords.size / 12) * 100));

  // ─── OVERALL ATS SCORE (weighted like real ATS systems) ───
  // TCS iON / similar: Skills ~25%, Experience ~20%, Sections ~15%, Projects ~15%,
  // Keywords ~15%, Formatting ~10%
  const overallScore = Math.round(
    skillsScore * 0.25 +
    experienceScore * 0.20 +
    sectionScore * 0.15 +
    projectsScore * 0.15 +
    keywordsScore * 0.15 +
    formatScore * 0.10
  );

  // Missing skills: top skills NOT found, prioritized by industry demand
  const missingSkills = INDUSTRY_SKILLS.filter(
    (s) => !matchedIndustry.some((m) => m.toLowerCase() === s.toLowerCase())
  ).slice(0, 15);

  return {
    overallScore,
    skillsScore,
    experienceScore,
    projectsScore,
    keywordsScore,
    formatScore,
    sectionScore,
    matchedIndustry,
    missingSkills,
    sections,
    actionVerbs,
    quantified,
    wordCount,
    bulletCount,
    hasEmail,
    hasPhone,
    hasLinkedIn,
    hasGitHub,
  };
}

// ─── Suggestion generator (context-aware) ───
function generateATSSuggestions(scores: ReturnType<typeof calculateATSScores>, aiSuggestions: string[]): string[] {
  const suggestions: string[] = [];

  // Section-based suggestions
  if (scores.sections.missing.length > 0) {
    suggestions.push(`Add missing sections: ${scores.sections.missing.join(", ")}. ATS parsers may reject resumes without these.`);
  }

  // Contact info
  if (!scores.hasEmail) suggestions.push("Add your email address — it's essential for ATS parsing and recruiter contact.");
  if (!scores.hasPhone) suggestions.push("Include your phone number for recruiter outreach.");
  if (!scores.hasLinkedIn) suggestions.push("Add your LinkedIn profile URL — 87% of recruiters check LinkedIn.");
  if (!scores.hasGitHub) suggestions.push("Include your GitHub profile to showcase your code and contributions.");

  // Quantified results
  if (scores.quantified.count < 3) {
    suggestions.push("Add more quantified achievements (e.g., 'Reduced API response time by 40%', 'Served 10K+ users'). Companies like TCS and Infosys specifically look for measurable impact.");
  }

  // Action verbs
  if (scores.actionVerbs.count < 8) {
    suggestions.push("Use stronger action verbs to describe your work: Built, Architected, Optimized, Deployed, Automated, Scaled. ATS systems rank these higher than passive descriptions.");
  }

  // Skills gap
  if (scores.skillsScore < 60) {
    suggestions.push("Your resume matches fewer than 10 industry-standard skills. Add relevant technologies and tools to your Skills section — ATS systems do keyword matching against job descriptions.");
  }

  // Formatting
  if (scores.bulletCount < 5) {
    suggestions.push("Use bullet points (•) to list achievements and responsibilities. ATS parsers extract structured bullet points more accurately than paragraphs.");
  }

  if (scores.wordCount < 200) {
    suggestions.push("Your resume appears too short. Aim for 300-700 words across 1-2 pages for optimal ATS scoring.");
  } else if (scores.wordCount > 1000) {
    suggestions.push("Your resume may be too long. Keep it to 1-2 pages — recruiters spend an average of 7.4 seconds on initial screening.");
  }

  // Projects
  if (scores.projectsScore < 40) {
    suggestions.push("Add 2-4 projects with clear descriptions mentioning the tech stack used, your role, and outcomes. Project quality matters more than quantity.");
  }

  // Merge with AI suggestions (deduplicate)
  for (const s of aiSuggestions) {
    if (!suggestions.some((existing) => existing.toLowerCase().includes(s.toLowerCase().substring(0, 30)))) {
      suggestions.push(s);
    }
  }

  return suggestions.slice(0, 10);
}

// ─── Main handler ───
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawBody = await req.json();
    const resumeText = (rawBody.resumeText || "")
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, " ")
      .replace(/\\u[0-9a-fA-F]{0,3}(?![0-9a-fA-F])/g, " ")
      .replace(/\uFFFD/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const { profileId, userId, resumeUrl } = rawBody;

    if (!resumeText || resumeText.length < 50) {
      return new Response(JSON.stringify({ error: "Resume text too short or empty" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // ─── AI extraction (structured data from resume) ───
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
            content: `You are an expert ATS (Applicant Tracking System) resume parser used by companies like TCS, Infosys, Wipro, and Accenture. Extract ALL structured information from the resume. Be extremely thorough — scan every line for skills, tools, frameworks, and technologies even if they appear in project descriptions or experience bullets, not just the Skills section.

Return ONLY valid JSON with this exact structure:
{
  "detected_skills": ["skill1", "skill2"],
  "education": ["degree - institution - year/CGPA"],
  "projects": ["project name - tech stack - brief outcome"],
  "certifications": ["cert name - issuing body"],
  "work_experience": ["role at company - duration - key achievement"],
  "keywords_found": ["keyword1", "keyword2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "contact_info": { "has_email": true, "has_phone": true, "has_linkedin": false, "has_github": false },
  "summary_present": true,
  "estimated_experience_years": 0
}

Rules:
- For detected_skills: extract EVERY technology, language, framework, tool, methodology mentioned ANYWHERE in the resume
- For projects: include tech stack used and any measurable outcome
- For work_experience: include duration and a key achievement with numbers if available
- For keywords_found: extract domain-specific terms (e.g., "full-stack", "cloud-native", "microservices architecture")
- For suggestions: provide 3-5 specific, actionable improvements based on what's MISSING or WEAK`,
          },
          {
            role: "user",
            content: `Parse this resume thoroughly:\n\n${resumeText.substring(0, 10000)}`,
          },
        ],
        temperature: 0.2,
        max_tokens: 3000,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";

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

    // ─── Run ATS scoring engine ───
    const atsScores = calculateATSScores(resumeText, parsed);

    // ─── Generate context-aware suggestions ───
    const suggestions = generateATSSuggestions(atsScores, parsed.suggestions || []);

    const education: string[] = parsed.education || [];
    const projects: string[] = parsed.projects || [];
    const certifications: string[] = parsed.certifications || [];
    const workExperience: string[] = parsed.work_experience || [];

    // ─── Store in database ───
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase.from("resume_analyses").insert({
      profile_id: profileId || null,
      user_id: userId || null,
      resume_url: resumeUrl || null,
      resume_score: atsScores.overallScore,
      detected_skills: atsScores.matchedIndustry,
      missing_skills: atsScores.missingSkills,
      education,
      projects,
      certifications,
      work_experience: workExperience,
      suggestions,
      skills_score: atsScores.skillsScore,
      projects_score: atsScores.projectsScore,
      experience_score: atsScores.experienceScore,
      keywords_score: atsScores.keywordsScore,
      raw_text: resumeText.substring(0, 5000),
    }).select().single();

    if (error) throw error;

    return new Response(JSON.stringify({
      id: data.id,
      resume_score: atsScores.overallScore,
      skills_score: atsScores.skillsScore,
      projects_score: atsScores.projectsScore,
      experience_score: atsScores.experienceScore,
      keywords_score: atsScores.keywordsScore,
      format_score: atsScores.formatScore,
      section_score: atsScores.sectionScore,
      detected_skills: atsScores.matchedIndustry,
      missing_skills: atsScores.missingSkills,
      education,
      projects,
      certifications,
      work_experience: workExperience,
      suggestions,
      ats_details: {
        sections_found: atsScores.sections.found,
        sections_missing: atsScores.sections.missing,
        action_verbs_used: atsScores.actionVerbs.count,
        quantified_achievements: atsScores.quantified.count,
        word_count: atsScores.wordCount,
        bullet_points: atsScores.bulletCount,
        has_email: atsScores.hasEmail,
        has_phone: atsScores.hasPhone,
        has_linkedin: atsScores.hasLinkedIn,
        has_github: atsScores.hasGitHub,
      },
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
