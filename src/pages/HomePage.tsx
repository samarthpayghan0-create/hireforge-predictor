import { Link } from "react-router-dom";
import { ArrowRight, Brain, BookOpen, Mic, BarChart3, CheckCircle2, Zap, Target, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const features = [
  {
    icon: Brain,
    title: "Placement Predictor",
    desc: "A weighted score across CGPA, DSA, aptitude, communication and experience — so the number actually means something.",
  },
  {
    icon: Target,
    title: "Skill Gap Analyzer",
    desc: "Compares your skills against what recruiters test for, and flags what to fix first.",
  },
  {
    icon: Mic,
    title: "Mock Interviews",
    desc: "Answer out loud and get scored on pace, filler words and clarity — the things panels notice.",
  },
  {
    icon: BarChart3,
    title: "Progress Dashboard",
    desc: "Every quiz, interview and resume score in one place, tracked week over week.",
  },
];

export default function HomePage() {
  const [studentCount, setStudentCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [avgRating, setAvgRating] = useState<number | null>(null);

  const fetchStats = async () => {
    const [countRes, ratingRes, usersRes] = await Promise.all([
      supabase.from("student_profiles").select("*", { count: "exact", head: true }),
      supabase.from("app_ratings").select("rating"),
      supabase.functions.invoke("list-users"),
    ]);
    setStudentCount(countRes.count ?? 0);
    if (ratingRes.data && ratingRes.data.length > 0) {
      const avg = ratingRes.data.reduce((sum, r) => sum + r.rating, 0) / ratingRes.data.length;
      setAvgRating(Math.round(avg * 10) / 10);
    }
    if (usersRes.data && Array.isArray(usersRes.data)) {
      setUserCount(usersRes.data.length);
    }
  };

  useEffect(() => {
    fetchStats();

    const channel = supabase
      .channel("homepage-stats")
      .on("postgres_changes", { event: "*", schema: "public", table: "student_profiles" }, () => fetchStats())
      .on("postgres_changes", { event: "*", schema: "public", table: "app_ratings" }, () => fetchStats())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const highlights = [
    { value: "8+", label: "Assessment Tools" },
    { value: avgRating ? `${avgRating}★` : "—", label: "User Rating" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32 lg:py-40 border-b border-border">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center space-y-10">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-secondary text-foreground text-sm font-medium border border-border animate-fade-in">
              Built for campus placement season
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-foreground leading-[1.05] tracking-tight animate-fade-in" style={{ animationDelay: '100ms' }}>
              Know exactly where you stand{" "}
              <span className="text-accent">before</span>
              <br />
              placement season starts
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '200ms' }}>
              HireForge scores your resume the way an ATS would, drills you with timed
              quizzes and spoken mock interviews, and turns it all into one placement
              readiness number — plus a plan to raise it.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90 transition-all text-base px-8 py-6 rounded-md font-medium">
                <Link to="/profile">
                  Start Assessment <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>First result in under 10 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>No sign-up needed to try it</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-secondary/50 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {highlights.map((item, i) => (
              <div key={i} className="text-center animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <p className="text-3xl md:text-4xl font-display font-bold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold text-accent uppercase tracking-widest mb-4">What's inside</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Four tools that share one profile
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
              Each assessment feeds the same profile, so your prediction gets sharper every time you use it.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group p-8 rounded-lg border border-border bg-card hover:border-foreground/30 hover:shadow-md transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-md bg-foreground flex items-center justify-center mb-6 transition-colors">
                  <f.icon className="w-5 h-5 text-background" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-3 text-foreground">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 md:py-32 bg-secondary/40 border-y border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold text-accent uppercase tracking-widest mb-4">Methodology</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Four steps, in order
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              A systematic approach to career readiness evaluation
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { step: "01", title: "Profile Creation", desc: "Input academic credentials and professional experience", icon: BookOpen },
                { step: "02", title: "Skills Assessment", desc: "Complete domain-specific competency evaluations", icon: Mic },
                { step: "03", title: "Communication Analysis", desc: "Voice-based assessment of presentation skills", icon: BarChart3 },
                { step: "04", title: "Your Readiness Report", desc: "See your score, your gaps, and a 30-day plan to close them", icon: TrendingUp },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-5 p-6 rounded-lg bg-card border border-border hover:border-foreground/30 transition-all animate-fade-in"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-md bg-foreground text-background flex items-center justify-center font-display font-bold text-lg">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-5 h-5 text-accent flex-shrink-0" />
                        <h3 className="font-display font-semibold text-foreground">{item.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto rounded-lg bg-foreground p-12 md:p-16 text-center">
            <div className="w-12 h-12 rounded-md bg-background/10 flex items-center justify-center mx-auto mb-8">
              <Zap className="w-6 h-6 text-background" />
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-background mb-4">
              Placement season won't wait
            </h2>
            <p className="text-background/70 max-w-xl mx-auto mb-10 text-lg">
              Build your profile once, then track your readiness every week until the offers come in.
            </p>
            <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90 text-base px-10 py-6 rounded-md font-medium">
              <Link to="/profile">
                Begin Assessment <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-foreground flex items-center justify-center">
                <Zap className="w-4 h-4 text-background" />
              </div>
              <span className="font-display font-semibold text-foreground">HireForge</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/admin" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Shield className="w-4 h-4" /> Admin
              </Link>
              <p className="text-sm text-muted-foreground">
                © 2026 HireForge. Built with precision for aspiring professionals.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
