import { Link } from "react-router-dom";
import { ArrowRight, Brain, BookOpen, Mic, BarChart3, Sparkles, CheckCircle2, Zap, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const features = [
  { 
    icon: Brain, 
    title: "AI Placement Prediction", 
    desc: "ML-powered analysis of your placement probability with actionable insights",
    color: "gradient-primary",
    shadowColor: "shadow-glow"
  },
  { 
    icon: Target, 
    title: "Skill Gap Analyzer", 
    desc: "Identify weak areas and get personalized improvement roadmaps",
    color: "gradient-accent",
    shadowColor: "shadow-glow-accent"
  },
  { 
    icon: Mic, 
    title: "Mock Interview", 
    desc: "Practice with AI-powered interview questions and get scored on communication",
    color: "gradient-warm",
    shadowColor: ""
  },
  { 
    icon: BarChart3, 
    title: "Smart Dashboard", 
    desc: "Comprehensive view of all your metrics in one place",
    color: "gradient-primary",
    shadowColor: "shadow-glow"
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

  const stats = [
    { value: "90%", label: "Prediction Accuracy" },
    { value: `${userCount}`, label: "Registered Users" },
    { value: `${studentCount}+`, label: "Students Analyzed" },
    { value: avgRating ? `${avgRating}★` : "—", label: "User Rating" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32 lg:py-40 border-b border-border/40">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/[0.03] rounded-full blur-[100px]" />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-foreground text-sm font-medium border border-border animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              Enterprise-Grade Career Intelligence
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-foreground leading-[1.05] tracking-tight animate-fade-in" style={{ animationDelay: '100ms' }}>
              Data-Driven{" "}
              <span className="text-gradient">Placement</span>
              <br />
              <span className="text-gradient-accent">Analytics</span> Platform
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '200ms' }}>
              Leverage AI-powered analytics to assess your competencies, identify skill gaps, 
              and receive actionable insights for career advancement.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90 transition-all text-base px-8 py-6 rounded-lg font-medium">
                <Link to="/profile">
                  Start Assessment <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8 py-6 rounded-lg border-2 border-border hover:bg-secondary">
                <Link to="/quiz">
                  View Demo <BookOpen className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="pt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>Free to Start</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>Instant Results</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-secondary/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <p className="text-3xl md:text-4xl font-display font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-2 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest mb-4 px-3 py-1 bg-primary/10 rounded-full">Capabilities</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Comprehensive Assessment Suite
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
              Advanced tools engineered to evaluate, enhance, and forecast your career trajectory
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div 
                key={i} 
                className="group p-8 rounded-2xl border border-border bg-card hover:border-primary/20 hover:shadow-lg transition-all duration-300 animate-fade-in" 
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-3 text-foreground">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 md:py-32 bg-secondary/30 border-y border-border/40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold text-accent uppercase tracking-widest mb-4 px-3 py-1 bg-accent/10 rounded-full">Methodology</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Structured Assessment Process
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              A systematic approach to career readiness evaluation
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { step: "01", title: "Profile Creation", desc: "Input academic credentials and professional experience", icon: User },
                { step: "02", title: "Skills Assessment", desc: "Complete domain-specific competency evaluations", icon: BookOpen },
                { step: "03", title: "Communication Analysis", desc: "Voice-based assessment of presentation skills", icon: Mic },
                { step: "04", title: "AI-Powered Insights", desc: "Receive data-driven recommendations and roadmaps", icon: TrendingUp },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={i} 
                    className="flex items-start gap-5 p-6 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all animate-fade-in" 
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-foreground text-background flex items-center justify-center font-display font-bold text-lg">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-5 h-5 text-primary flex-shrink-0" />
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
          <div className="max-w-4xl mx-auto rounded-3xl bg-foreground p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-background/10 flex items-center justify-center mx-auto mb-8">
                <Zap className="w-7 h-7 text-background" />
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-background mb-4">
                Ready to Accelerate Your Career?
              </h2>
              <p className="text-background/60 max-w-xl mx-auto mb-10 text-lg">
                Join thousands of professionals who've optimized their career trajectory with our AI-powered analytics platform.
              </p>
              <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90 text-base px-10 py-6 rounded-lg font-medium">
                <Link to="/profile">
                  Begin Assessment <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
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

// Import User icon
import { User } from "lucide-react";
