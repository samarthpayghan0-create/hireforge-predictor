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
    <div className="min-h-screen bg-pattern">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 lg:py-40">
        {/* Background effects */}
        <div className="absolute inset-0 gradient-hero opacity-[0.03]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              AI-Powered Career Analysis Platform
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-foreground leading-[1.1] animate-fade-in" style={{ animationDelay: '100ms' }}>
              Predict Your{" "}
              <span className="text-gradient">Placement</span>
              <br />
              <span className="text-gradient-accent">Success</span> with AI
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '200ms' }}>
              Analyze your skills, take comprehensive quizzes, assess communication abilities — 
              get AI-driven predictions and personalized improvement strategies.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <Button asChild size="lg" className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-all text-base px-8 py-6 rounded-xl">
                <Link to="/profile">
                  Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8 py-6 rounded-xl border-2">
                <Link to="/quiz">
                  Take a Quiz <BookOpen className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 border-y border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <p className="text-3xl md:text-4xl font-display font-bold text-gradient">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Features</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-3">
              Everything You Need to Succeed
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Comprehensive tools designed to analyze, improve, and predict your placement success
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div 
                key={i} 
                className="card-interactive p-6 animate-fade-in" 
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-2xl ${f.color} ${f.shadowColor} flex items-center justify-center mb-5`}>
                  <f.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2 text-foreground">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">Process</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-3">
              Your Journey to Success
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { step: "01", title: "Create Your Profile", desc: "Enter your academic and skill details", icon: User },
              { step: "02", title: "Take Skill Assessment", desc: "Optional quizzes to measure your abilities", icon: BookOpen },
              { step: "03", title: "Voice Analysis", desc: "Record a sample to assess communication", icon: Mic },
              { step: "04", title: "Get AI Predictions", desc: "Receive personalized recommendations", icon: TrendingUp },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div 
                  key={i} 
                  className="flex items-center gap-5 card-interactive p-5 animate-slide-in" 
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-display font-bold text-gradient">{item.step}</span>
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-success shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="card-elevated gradient-dark p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <Zap className="w-12 h-12 text-warning mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                Ready to Predict Your Future?
              </h2>
              <p className="text-white/70 max-w-xl mx-auto mb-8">
                Join thousands of students who've already improved their placement chances with our AI-powered platform.
              </p>
              <Button asChild size="lg" className="bg-white text-foreground hover:bg-white/90 text-base px-8 py-6 rounded-xl">
                <Link to="/profile">
                  Start Your Analysis <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 HireForge. Built with ❤️ for students.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Import User icon
import { User } from "lucide-react";
