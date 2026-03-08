import { Button } from "@/components/ui/button";
import {
  Printer, Brain, FileText, Mic, Code, Compass, Map, TrendingUp, BarChart3,
  Users, Sparkles, Target, Shield, Zap, CheckCircle2, ArrowRight
} from "lucide-react";

const sections = [
  {
    title: "1. Introduction",
    icon: Sparkles,
    content: `Good morning/afternoon respected teachers and dear fellow students,

My name is __________ and today I'm excited to present our project — **HireForge**, an AI-powered Career Readiness & Placement Preparation Platform.

In today's competitive job market, students often struggle to understand where they stand and what skills they need to develop. HireForge bridges that gap using Artificial Intelligence and data-driven insights to help students become placement-ready.`,
  },
  {
    title: "2. Problem Statement",
    icon: Target,
    content: `The key challenges students face today:

• **Lack of self-assessment tools** — Students don't know their placement probability or skill gaps.
• **No structured preparation path** — Scattered resources with no clear roadmap.
• **Limited mock interview practice** — Real interviews are high-pressure with no room for mistakes.
• **Resume quality issues** — Students submit resumes without professional feedback.
• **No coding practice platform** — Difficulty finding curated coding challenges aligned with placement patterns.

HireForge solves ALL of these problems in a single, unified platform.`,
  },
  {
    title: "3. Key Features",
    icon: Zap,
    subsections: [
      {
        title: "🎯 AI Placement Predictor",
        icon: TrendingUp,
        content: `Our ML-powered predictor analyzes a student's profile — CGPA, DSA skills, aptitude scores, projects, internships, and communication rating — to predict their placement probability with actionable insights. Students get a clear percentage score and personalized improvement tips.`,
      },
      {
        title: "📄 Resume Analyzer",
        icon: FileText,
        content: `Students can upload their resume and receive an AI-powered analysis that scores their resume across multiple dimensions: skills coverage, experience, projects, and keyword optimization. The system detects missing skills and provides targeted suggestions for improvement.`,
      },
      {
        title: "🎤 AI Mock Interview",
        icon: Mic,
        content: `Our AI-powered mock interview module generates role-specific interview questions across categories like Technical, Behavioral, HR, and more. Students answer questions and receive detailed AI feedback with scores on relevance, depth, communication, and overall performance.`,
      },
      {
        title: "💻 Coding Challenge Game",
        icon: Code,
        content: `A gamified coding environment with a built-in Monaco code editor supporting Python, Java, C++, and JavaScript. Features include:
• MAANG-style coding problems categorized by difficulty
• 5-minute timed challenges with real-time countdown
• AI-powered code evaluation with detailed feedback
• Run Code button to test against sample cases before submitting
• Real-time leaderboard with scoring and ranking system
• Solution viewer that unlocks after failed attempts`,
      },
      {
        title: "🧭 Career Paths & Recommendations",
        icon: Compass,
        content: `Based on the student's skill profile, the platform generates personalized career path recommendations using AI. It provides detailed roadmaps showing which skills to learn, in what order, and estimated timelines to become job-ready for specific roles.`,
      },
      {
        title: "📚 Learning Roadmap (Quiz System)",
        icon: Map,
        content: `An interactive quiz system covering Aptitude, Programming, Data Structures, and Core Subjects. Students can test their knowledge, track scores over time, and identify weak areas that need more practice.`,
      },
      {
        title: "📊 Progress Dashboard",
        icon: BarChart3,
        content: `A comprehensive analytics dashboard that aggregates all student data — quiz scores, interview performance, coding statistics, resume scores, and placement prediction trends — into beautiful charts and actionable insights.`,
      },
    ],
  },
  {
    title: "4. Technology Stack",
    icon: Shield,
    content: `HireForge is built with modern, production-grade technologies:

• **Frontend**: React.js with TypeScript, Tailwind CSS, shadcn/ui components
• **Backend**: Lovable Cloud (Supabase) — PostgreSQL database, Edge Functions, Authentication
• **AI Integration**: Lovable AI Gateway — Google Gemini & OpenAI models for code evaluation, interview feedback, resume analysis, and career recommendations
• **Code Editor**: Monaco Editor (same engine as VS Code)
• **Real-time**: Live leaderboard updates using database subscriptions
• **Design**: Responsive design with dark/light theme support, glassmorphism effects, Space Grotesk + Inter typography`,
  },
  {
    title: "5. How It Works",
    icon: ArrowRight,
    content: `**Step 1**: Student signs up and creates a profile with academic and skill details.

**Step 2**: The AI analyzes their profile and predicts placement probability.

**Step 3**: Based on the analysis, students receive personalized recommendations:
   - Skills to improve
   - Career paths to explore
   - Practice problems to solve

**Step 4**: Students use the platform's tools — mock interviews, coding challenges, resume analyzer — to improve their skills.

**Step 5**: Track progress over time through the dashboard and watch their placement probability increase!`,
  },
  {
    title: "6. Unique Selling Points",
    icon: CheckCircle2,
    content: `What makes HireForge stand out:

✅ **All-in-One Platform** — No need to switch between multiple tools and websites.
✅ **AI-Powered Insights** — Not just practice, but intelligent feedback and recommendations.
✅ **Gamified Learning** — Leaderboards, points, and timed challenges make preparation engaging.
✅ **Real-time Analytics** — Track improvement with detailed dashboards and charts.
✅ **Modern UI/UX** — Professional, responsive design that works on all devices.
✅ **Secure & Scalable** — Built on enterprise-grade cloud infrastructure.
✅ **Free to Use** — Accessible to all students regardless of background.`,
  },
  {
    title: "7. Future Scope",
    icon: Sparkles,
    content: `We plan to expand HireForge with:

• **Job Recommendations** — AI-matched job listings based on student profiles
• **Company-Specific Preparation** — Tailored prep for specific companies (TCS, Infosys, Google, etc.)
• **Peer Collaboration** — Study groups and coding pair programming
• **Voice-Based Interview Practice** — Speech-to-text powered interview simulation
• **Certificate Generation** — Completion certificates for courses and challenges
• **Mobile App** — Native Android/iOS application`,
  },
  {
    title: "8. Conclusion",
    icon: Users,
    content: `To summarize, HireForge is a comprehensive, AI-powered platform that transforms how students prepare for placements. By combining prediction, practice, and personalized guidance, we aim to increase placement success rates and help every student reach their full potential.

We believe that with the right tools and guidance, every student can crack their dream placement.

**Thank you for your time and attention!**

We'd be happy to take any questions or give a live demo of the platform.

---

*Project: HireForge — AI-Powered Career Readiness Platform*
*Built with: React, TypeScript, Lovable Cloud, AI/ML*
*Team: __________*
*Date: __________*`,
  },
];

export default function SpeechPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Print button - hidden when printing */}
      <div className="print:hidden sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border/30 p-4">
        <div className="container mx-auto max-w-4xl flex items-center justify-between">
          <div>
            <h2 className="text-lg font-display font-bold text-foreground">Presentation Speech</h2>
            <p className="text-sm text-muted-foreground">Save as PDF: Print → Destination → Save as PDF</p>
          </div>
          <Button onClick={handlePrint} className="gradient-primary text-primary-foreground rounded-xl gap-2 font-semibold">
            <Printer className="w-4 h-4" /> Print / Save PDF
          </Button>
        </div>
      </div>

      {/* Speech content */}
      <div className="container mx-auto max-w-4xl px-6 py-10 print:px-0 print:py-0 print:max-w-none">
        {/* Cover / Title */}
        <div className="text-center mb-12 print:mb-8 print:pt-16 page-break-after">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary shadow-glow mb-6 print:shadow-none">
            <Brain className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight mb-4 print:text-4xl">
            HireForge
          </h1>
          <p className="text-xl text-primary font-semibold mb-2">
            AI-Powered Career Readiness & Placement Preparation Platform
          </p>
          <p className="text-muted-foreground text-lg mb-8">
            Project Presentation Speech
          </p>
          <div className="inline-block bg-secondary/50 rounded-xl px-6 py-4 text-left print:bg-gray-100">
            <p className="text-sm text-muted-foreground mb-1"><strong>Presented by:</strong> __________</p>
            <p className="text-sm text-muted-foreground mb-1"><strong>Guide/Mentor:</strong> __________</p>
            <p className="text-sm text-muted-foreground mb-1"><strong>Department:</strong> __________</p>
            <p className="text-sm text-muted-foreground"><strong>Date:</strong> {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-10 print:space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="print:break-inside-avoid">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 print:bg-gray-100">
                  <section.icon className="w-5 h-5 text-primary print:text-gray-700" />
                </div>
                <h2 className="text-2xl font-display font-bold text-foreground print:text-xl">
                  {section.title}
                </h2>
              </div>

              {section.content && (
                <div className="pl-[52px] print:pl-12">
                  <div className="prose prose-sm max-w-none text-foreground/90 leading-relaxed whitespace-pre-line print:text-sm">
                    {renderContent(section.content)}
                  </div>
                </div>
              )}

              {section.subsections && (
                <div className="pl-[52px] print:pl-12 space-y-6 print:space-y-4 mt-4">
                  {section.subsections.map((sub, subIdx) => (
                    <div key={subIdx} className="print:break-inside-avoid">
                      <div className="flex items-center gap-2 mb-2">
                        <sub.icon className="w-4 h-4 text-primary print:text-gray-600" />
                        <h3 className="text-lg font-display font-semibold text-foreground print:text-base">
                          {sub.title}
                        </h3>
                      </div>
                      <div className="pl-6 prose prose-sm max-w-none text-foreground/90 leading-relaxed whitespace-pre-line print:text-sm">
                        {renderContent(sub.content)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {idx < sections.length - 1 && (
                <hr className="mt-8 border-border/40 print:mt-4" />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 print:mt-10 text-center border-t border-border/40 pt-8 print:pt-4 print:break-inside-avoid">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} HireForge — AI-Powered Career Readiness Platform
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Built with React, TypeScript, Lovable Cloud & AI
          </p>
        </div>
      </div>
    </div>
  );
}

/** Renders markdown-like bold text */
function renderContent(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}
