import { Link } from "react-router-dom";
import { ArrowRight, Brain, BookOpen, Mic, BarChart3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Brain, title: "AI Placement Prediction", desc: "ML-powered analysis of your placement probability", color: "gradient-primary" },
  { icon: BookOpen, title: "Skill Gap Analyzer", desc: "Identify weak areas and get improvement plans", color: "gradient-accent" },
  { icon: Mic, title: "Voice Analyzer", desc: "Assess communication skills with speech analysis", color: "gradient-warm" },
  { icon: BarChart3, title: "Smart Dashboard", desc: "Comprehensive view of all your metrics", color: "gradient-primary" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              AI-Powered Career Analysis
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground leading-tight">
              Predict Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Placement</span> Success
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Analyze your skills, take quizzes, assess communication — get AI-driven predictions and personalized improvement plans.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button asChild size="lg" className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity">
                <Link to="/profile">
                  Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12 text-foreground">How It Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2 text-foreground">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12 text-foreground">Your Journey</h2>
          <div className="max-w-2xl mx-auto space-y-6">
            {["Create your profile", "Take the skill quiz (optional)", "Record a voice sample (optional)", "View AI predictions & recommendations"].map((step, i) => (
              <div key={i} className="flex items-center gap-4 animate-slide-in" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 bg-card rounded-xl border border-border p-4">
                  <p className="font-medium text-foreground">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
