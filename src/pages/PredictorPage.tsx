import { useState, useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import { Link } from "react-router-dom";
import { Building2, Rocket, Globe, AlertTriangle, ArrowRight, TrendingUp, CheckCircle2, Lightbulb, Target, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import SkillBar from "@/components/SkillBar";

type CompanyType = "startup" | "mnc" | "product";

interface Weights {
  cgpa: number;
  coding: number;
  projects: number;
  internship: number;
  communication: number;
  aptitude: number;
  technicalInterview: number;
  hrInterview: number;
}

const COMPANY_CONFIG: Record<CompanyType, { label: string; description: string; icon: typeof Building2; weights: Weights; examples: string }> = {
  startup: {
    label: "Startup",
    description: "Practical skills & projects matter most",
    icon: Rocket,
    examples: "Early-stage companies, Y Combinator startups",
    weights: { cgpa: 0.05, coding: 0.25, projects: 0.25, internship: 0.15, communication: 0.10, aptitude: 0.05, technicalInterview: 0.10, hrInterview: 0.05 },
  },
  mnc: {
    label: "MNC (Service-Based)",
    description: "Aptitude, communication & academics focused",
    icon: Globe,
    examples: "TCS, Infosys, Accenture, Wipro, Cognizant",
    weights: { cgpa: 0.15, coding: 0.15, projects: 0.10, internship: 0.10, communication: 0.15, aptitude: 0.25, technicalInterview: 0.05, hrInterview: 0.05 },
  },
  product: {
    label: "Product-Based",
    description: "Coding skills & technical depth prioritized",
    icon: Building2,
    examples: "Google, Amazon, Microsoft, Meta, Apple",
    weights: { cgpa: 0.10, coding: 0.30, projects: 0.20, internship: 0.15, communication: 0.05, aptitude: 0.10, technicalInterview: 0.05, hrInterview: 0.05 },
  },
};

const FIELDS: { key: keyof Weights; label: string }[] = [
  { key: "cgpa", label: "CGPA" },
  { key: "aptitude", label: "Aptitude Score" },
  { key: "coding", label: "Coding / DSA Skill" },
  { key: "projects", label: "Projects Score" },
  { key: "internship", label: "Internship Experience" },
  { key: "communication", label: "Communication Skill" },
  { key: "technicalInterview", label: "Technical Interview" },
  { key: "hrInterview", label: "HR Interview" },
];

function getStrengths(scores: Record<string, number>, weights: Weights) {
  const weighted = FIELDS.map(f => ({ ...f, value: scores[f.key], weight: weights[f.key], weighted: scores[f.key] * weights[f.key] }));
  weighted.sort((a, b) => b.weighted - a.weighted);
  return weighted.filter(w => w.value >= 7).slice(0, 3);
}

function getWeakAreas(scores: Record<string, number>, weights: Weights) {
  const weighted = FIELDS.map(f => ({ ...f, value: scores[f.key], weight: weights[f.key], weighted: scores[f.key] * weights[f.key] }));
  weighted.sort((a, b) => a.value - b.value);
  return weighted.filter(w => w.value < 7).slice(0, 3);
}

function getSuggestions(weakAreas: ReturnType<typeof getWeakAreas>, companyType: CompanyType) {
  const suggestions: string[] = [];
  const config = COMPANY_CONFIG[companyType];
  weakAreas.forEach(area => {
    const weightPct = Math.round(config.weights[area.key] * 100);
    if (area.key === "coding") suggestions.push(`Improve coding/DSA skills (${weightPct}% weight) — practice on LeetCode, HackerRank daily`);
    else if (area.key === "aptitude") suggestions.push(`Boost aptitude score (${weightPct}% weight) — solve problems on IndiaBix, PrepInsta`);
    else if (area.key === "communication") suggestions.push(`Enhance communication (${weightPct}% weight) — join Toastmasters, practice mock interviews`);
    else if (area.key === "projects") suggestions.push(`Build more projects (${weightPct}% weight) — contribute to open source, build portfolio`);
    else if (area.key === "internship") suggestions.push(`Gain internship experience (${weightPct}% weight) — apply on Internshala, LinkedIn`);
    else if (area.key === "cgpa") suggestions.push(`Improve CGPA (${weightPct}% weight) — focus on core subjects, attend classes regularly`);
    else if (area.key === "technicalInterview") suggestions.push(`Practice technical interviews (${weightPct}% weight) — use Pramp, InterviewBit`);
    else if (area.key === "hrInterview") suggestions.push(`Prepare for HR interviews (${weightPct}% weight) — practice common questions, improve soft skills`);
  });
  return suggestions;
}

export default function PredictorPage() {
  const { profile, quizScores, commResult } = useAppContext();
  const [companyType, setCompanyType] = useState<CompanyType | null>(null);

  // Initialize scores from profile data if available
  const [scores, setScores] = useState<Record<string, number>>(() => {
    if (profile) {
      const dsaQuiz = quizScores.find(s => s.category === "Data Structures");
      const aptQuiz = quizScores.find(s => s.category === "Aptitude");
      const commScore = commResult?.overall_score ?? profile.communication_rating;
      return {
        cgpa: profile.cgpa,
        aptitude: aptQuiz ? Math.round((aptQuiz.score / aptQuiz.total_questions) * 10) : Math.round(profile.aptitude_score / 10),
        coding: dsaQuiz ? Math.round((dsaQuiz.score / dsaQuiz.total_questions) * 10) : Math.round(profile.dsa_score / 10),
        projects: Math.min(10, profile.num_projects * 2),
        internship: Math.min(10, profile.internship_experience * 3),
        communication: Math.round(commScore / 10) || profile.communication_rating,
        technicalInterview: 5,
        hrInterview: 5,
      };
    }
    return { cgpa: 7, aptitude: 5, coding: 5, projects: 5, internship: 5, communication: 5, technicalInterview: 5, hrInterview: 5 };
  });

  const result = useMemo(() => {
    if (!companyType) return null;
    const weights = COMPANY_CONFIG[companyType].weights;
    const placementScore = FIELDS.reduce((sum, f) => sum + scores[f.key] * weights[f.key], 0);
    const probability = Math.min(99, Math.max(5, Math.round(placementScore * 10)));
    const strengths = getStrengths(scores, weights);
    const weakAreas = getWeakAreas(scores, weights);
    const suggestions = getSuggestions(weakAreas, companyType);
    return { probability, strengths, weakAreas, suggestions };
  }, [scores, companyType]);

  return (
    <div className="min-h-screen bg-pattern">
      <div className="container mx-auto px-4 lg:px-8 py-10 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-primary shadow-glow flex items-center justify-center">
            <TrendingUp className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Placement Predictor</h1>
            <p className="text-muted-foreground">Dynamic prediction based on company type</p>
          </div>
        </div>

        {/* Step 1: Company Type Selection */}
        <div className="card-elevated p-6 md:p-8 mb-6 animate-fade-in">
          <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" /> Select Target Company Type
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {(Object.entries(COMPANY_CONFIG) as [CompanyType, typeof COMPANY_CONFIG["startup"]][]).map(([key, config]) => {
              const Icon = config.icon;
              const isSelected = companyType === key;
              return (
                <button
                  key={key}
                  onClick={() => setCompanyType(key)}
                  className={`rounded-2xl p-5 text-left transition-all duration-300 border-2 ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-lg scale-[1.02]"
                      : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                    isSelected ? "gradient-primary shadow-glow" : "bg-secondary"
                  }`}>
                    <Icon className={`w-6 h-6 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  </div>
                  <h3 className="font-semibold text-foreground">{config.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{config.description}</p>
                  <p className="text-xs text-muted-foreground/70 mt-2 italic">{config.examples}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Input Scores */}
        <div className="card-elevated p-6 md:p-8 mb-6 animate-fade-in">
          <h2 className="font-display font-semibold text-lg text-foreground mb-1 flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" /> Your Scores
          </h2>
          <p className="text-xs text-muted-foreground mb-6">
            {profile ? "Pre-filled from your profile. Adjust as needed." : "Rate yourself on a scale of 0–10 for each skill."}
          </p>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
            {FIELDS.map(f => {
              const weight = companyType ? COMPANY_CONFIG[companyType].weights[f.key] : null;
              return (
                <div key={f.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">{f.label}</Label>
                    <div className="flex items-center gap-2">
                      {weight !== null && (
                        <span className="text-[10px] font-mono bg-secondary text-muted-foreground px-1.5 py-0.5 rounded">
                          {Math.round(weight * 100)}%
                        </span>
                      )}
                      <span className={`text-sm font-bold ${
                        scores[f.key] >= 7 ? "text-success" : scores[f.key] >= 4 ? "text-warning" : "text-destructive"
                      }`}>
                        {scores[f.key]}/10
                      </span>
                    </div>
                  </div>
                  <Slider
                    value={[scores[f.key]]}
                    onValueChange={([v]) => setScores(prev => ({ ...prev, [f.key]: v }))}
                    min={0} max={10} step={1}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3-6: Results */}
        {result && companyType && (
          <div className="space-y-6 animate-fade-in">
            {/* Probability Banner */}
            <div className={`card-elevated p-6 md:p-8 relative overflow-hidden border-2 ${
              result.probability >= 60 ? "border-success/30" : "border-destructive/30"
            }`}>
              <div className={`absolute inset-0 ${result.probability >= 60 ? "bg-success/5" : "bg-destructive/5"}`} />
              <div className="relative">
                <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">
                      Company Type: <span className="text-foreground font-semibold">{COMPANY_CONFIG[companyType].label}</span>
                    </p>
                    <p className={`text-2xl md:text-3xl font-display font-bold ${
                      result.probability >= 60 ? "text-success" : "text-destructive"
                    }`}>
                      {result.probability >= 60 ? "Likely Placed" : "Needs Improvement"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Placement Probability</p>
                    <p className={`text-5xl md:text-6xl font-display font-bold ${
                      result.probability >= 60 ? "text-gradient-accent" : "text-gradient"
                    }`}>
                      {result.probability}%
                    </p>
                  </div>
                </div>
                <Progress value={result.probability} className="h-3 rounded-full" />
              </div>
            </div>

            {/* Skill Analysis Chart */}
            <div className="card-elevated p-6 md:p-8">
              <h2 className="font-display font-semibold text-lg text-foreground mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" /> Skill Analysis
              </h2>
              <div className="space-y-4">
                {FIELDS.map(f => {
                  const weight = COMPANY_CONFIG[companyType].weights[f.key];
                  const contribution = Math.round(scores[f.key] * weight * 10);
                  return (
                    <div key={f.key} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{f.label}</span>
                        <span className="text-muted-foreground">
                          {scores[f.key]}/10 × {Math.round(weight * 100)}% = <span className="font-bold text-foreground">{contribution}%</span>
                        </span>
                      </div>
                      <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            scores[f.key] >= 7 ? "bg-success" : scores[f.key] >= 4 ? "bg-warning" : "bg-destructive"
                          }`}
                          style={{ width: `${scores[f.key] * 10}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="card-elevated p-6 border-2 border-success/20 bg-success/5">
                <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" /> Strengths
                </h2>
                {result.strengths.length > 0 ? (
                  <ul className="space-y-3">
                    {result.strengths.map(s => (
                      <li key={s.key} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center text-success font-bold text-sm">
                          {s.value}
                        </div>
                        <span className="text-sm text-foreground font-medium">{s.label}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Score 7+ in areas to see strengths here.</p>
                )}
              </div>

              {/* Weak Areas */}
              <div className="card-elevated p-6 border-2 border-destructive/20 bg-destructive/5">
                <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" /> Areas to Improve
                </h2>
                {result.weakAreas.length > 0 ? (
                  <ul className="space-y-3">
                    {result.weakAreas.map(w => (
                      <li key={w.key} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive font-bold text-sm">
                          {w.value}
                        </div>
                        <span className="text-sm text-foreground font-medium">{w.label}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">All scores are strong! 🎉</p>
                )}
              </div>
            </div>

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div className="card-elevated p-6 md:p-8">
                <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-warning" /> Suggestions to Improve
                </h2>
                <ul className="space-y-3">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 bg-warning/5 rounded-xl p-4 border border-warning/10">
                      <span className="w-6 h-6 rounded-full bg-warning/10 text-warning flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-sm text-foreground">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {!companyType && (
          <div className="text-center py-12 text-muted-foreground animate-fade-in">
            <Target className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Select a company type above to see your prediction</p>
          </div>
        )}
      </div>
    </div>
  );
}
