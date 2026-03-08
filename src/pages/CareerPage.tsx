import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Compass, Loader2, Code, Database, Globe, Cloud, BarChart3, Shield,
  Cpu, Smartphone, Brain, Layers, TrendingUp, CheckCircle2, ArrowRight,
  Map, Clock, BookOpen, ExternalLink, RefreshCw, AlertTriangle
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  code: Code, database: Database, globe: Globe, cloud: Cloud,
  "bar-chart": BarChart3, shield: Shield, cpu: Cpu, smartphone: Smartphone,
  brain: Brain, layers: Layers,
};

interface Recommendation {
  title: string;
  match_percentage: number;
  icon: string;
  explanation: string;
  key_skills: string[];
  salary_range: string;
  growth: string;
}

interface RoadmapStep {
  step: number;
  title: string;
  description: string;
  topics: string[];
  resources: { name: string; url: string; type: string }[];
  timeline: string;
  priority: string;
}

interface RoadmapResult {
  roadmap: RoadmapStep[];
  estimated_total_time: string;
  career_goal: string;
}

export default function CareerPage() {
  const { profile, profileId, quizScores } = useAppContext();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapResult | null>(null);
  const [phase, setPhase] = useState<"start" | "recommendations" | "roadmap">("start");
  const [selectedCareer, setSelectedCareer] = useState<string>("");
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const getRecommendations = async () => {
    if (!profile) { toast.error("Create a profile first"); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("career-roadmap", {
        body: {
          action: "recommend",
          profileData: {
            ...profile,
            quiz_scores: quizScores,
          },
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setRecommendations(data.recommendations || []);
      setPhase("recommendations");
      toast.success("Career paths generated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to get recommendations");
    } finally {
      setLoading(false);
    }
  };

  const generateRoadmap = async (careerGoal: string) => {
    if (!profile) return;
    setSelectedCareer(careerGoal);
    setLoadingRoadmap(true);
    try {
      const { data, error } = await supabase.functions.invoke("career-roadmap", {
        body: {
          action: "roadmap",
          profileData: {
            ...profile,
            quiz_scores: quizScores,
            career_goal: careerGoal,
            recommendations,
          },
          profileId: profileId || null,
          userId: user?.id || null,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setRoadmap(data);
      setPhase("roadmap");
      toast.success("Learning roadmap created!");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate roadmap");
    } finally {
      setLoadingRoadmap(false);
    }
  };

  const toggleStep = (step: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.has(step) ? next.delete(step) : next.add(step);
      return next;
    });
  };

  // START
  if (phase === "start") {
    return (
      <div className="min-h-screen bg-pattern">
        <div className="container mx-auto px-4 lg:px-8 py-10 max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center">
              <Compass className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Career & Roadmap</h1>
              <p className="text-muted-foreground">AI-powered career guidance & learning paths</p>
            </div>
          </div>

          <div className="card-elevated p-6 md:p-8 space-y-6 animate-fade-in">
            <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
              <h3 className="font-semibold text-foreground mb-2">What you'll get</h3>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li>🎯 Top 3 career recommendations based on your profile</li>
                <li>📊 Match percentage for each career path</li>
                <li>🗺️ Personalized step-by-step learning roadmap</li>
                <li>📚 Curated resources and timelines</li>
              </ul>
            </div>

            {!profile ? (
              <div className="text-center py-6">
                <AlertTriangle className="w-10 h-10 text-warning mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">Create your profile first to get personalized recommendations</p>
                <Button asChild className="gradient-primary text-primary-foreground rounded-xl">
                  <Link to="/profile">Create Profile <ArrowRight className="w-4 h-4 ml-2" /></Link>
                </Button>
              </div>
            ) : (
              <Button onClick={getRecommendations} disabled={loading} className="w-full gradient-primary text-primary-foreground h-14 text-lg rounded-xl shadow-glow">
                {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing...</> : <><Compass className="w-5 h-5 mr-2" /> Get Career Recommendations</>}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // RECOMMENDATIONS
  if (phase === "recommendations") {
    return (
      <div className="min-h-screen bg-pattern">
        <div className="container mx-auto px-4 lg:px-8 py-10 max-w-3xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center">
              <Compass className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Your Career Paths</h1>
              <p className="text-muted-foreground">Top recommendations based on your profile</p>
            </div>
          </div>

          <div className="space-y-4 animate-fade-in">
            {recommendations.map((rec, i) => {
              const Icon = ICON_MAP[rec.icon] || Compass;
              return (
                <div key={i} className="card-elevated p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                      i === 0 ? "gradient-primary shadow-glow" : i === 1 ? "gradient-accent" : "gradient-warm"
                    }`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">#{i + 1} Recommended</p>
                          <h3 className="text-xl font-display font-bold text-foreground">{rec.title}</h3>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-3xl font-display font-bold ${
                            rec.match_percentage >= 70 ? "text-success" : rec.match_percentage >= 50 ? "text-warning" : "text-destructive"
                          }`}>{rec.match_percentage}%</p>
                          <p className="text-xs text-muted-foreground">match</p>
                        </div>
                      </div>
                      <Progress value={rec.match_percentage} className="h-2 mt-3 mb-3" />
                      <p className="text-sm text-muted-foreground">{rec.explanation}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {rec.key_skills?.map((s) => (
                          <span key={s} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">{s}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span>💰 {rec.salary_range}</span>
                        <span>📈 {rec.growth} growth</span>
                      </div>
                      <Button
                        onClick={() => generateRoadmap(rec.title)}
                        disabled={loadingRoadmap}
                        className="mt-4 gradient-accent text-accent-foreground rounded-xl"
                        size="sm"
                      >
                        {loadingRoadmap && selectedCareer === rec.title ? (
                          <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Generating...</>
                        ) : (
                          <><Map className="w-4 h-4 mr-1" /> Generate Roadmap</>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-6">
            <Button onClick={() => setPhase("start")} variant="outline" className="rounded-xl">
              <RefreshCw className="w-4 h-4 mr-2" /> Start Over
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ROADMAP
  const progress = roadmap?.roadmap?.length ? Math.round((completedSteps.size / roadmap.roadmap.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-pattern">
      <div className="container mx-auto px-4 lg:px-8 py-10 max-w-3xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl gradient-accent shadow-glow-accent flex items-center justify-center">
            <Map className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Learning Roadmap</h1>
            <p className="text-muted-foreground">{roadmap?.career_goal || selectedCareer}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="card-elevated p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-foreground">Progress</span>
            <span className="text-sm text-muted-foreground">{completedSteps.size}/{roadmap?.roadmap?.length || 0} steps • {roadmap?.estimated_total_time}</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Timeline */}
        <div className="space-y-0 animate-fade-in">
          {roadmap?.roadmap?.map((step, i) => {
            const done = completedSteps.has(step.step);
            return (
              <div key={i} className="relative pl-10">
                {/* Timeline line */}
                {i < (roadmap.roadmap.length - 1) && (
                  <div className={`absolute left-[18px] top-10 w-0.5 h-full ${done ? "bg-success" : "bg-border"}`} />
                )}
                {/* Timeline dot */}
                <button
                  onClick={() => toggleStep(step.step)}
                  className={`absolute left-2 top-3 w-5 h-5 rounded-full border-2 transition-all ${
                    done ? "bg-success border-success" : "bg-background border-primary"
                  }`}
                >
                  {done && <CheckCircle2 className="w-3 h-3 text-white absolute top-0.5 left-0.5" />}
                </button>

                <div className={`card-elevated p-5 mb-4 transition-all ${done ? "opacity-60" : ""}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full inline-block mb-2 ${
                        step.priority === "high" ? "bg-destructive/10 text-destructive" : step.priority === "medium" ? "bg-warning/10 text-warning" : "bg-info/10 text-info"
                      }`}>Step {step.step} • {step.priority}</p>
                      <h3 className={`font-display font-bold text-lg ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>{step.title}</h3>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <Clock className="w-3.5 h-3.5" /> {step.timeline}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{step.description}</p>

                  {step.topics?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {step.topics.map((t) => (
                        <span key={t} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{t}</span>
                      ))}
                    </div>
                  )}

                  {step.resources?.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      {step.resources.map((r, ri) => (
                        <a key={ri} href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                          <ExternalLink className="w-3.5 h-3.5" />
                          {r.name}
                          <span className="text-xs text-muted-foreground">({r.type})</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 mt-6 justify-center">
          <Button onClick={() => setPhase("recommendations")} variant="outline" className="rounded-xl">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Careers
          </Button>
          <Button onClick={() => { setPhase("start"); setRoadmap(null); setRecommendations([]); setCompletedSteps(new Set()); }} variant="outline" className="rounded-xl">
            <RefreshCw className="w-4 h-4 mr-1" /> Start Over
          </Button>
        </div>
      </div>
    </div>
  );
}
