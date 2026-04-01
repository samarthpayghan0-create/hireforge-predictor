import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { Brain, BookOpen, Mic, TrendingUp, AlertTriangle, CheckCircle2, Lightbulb, Target, Zap, ArrowRight, Star, Sparkles, Loader2, Calendar, Rocket, ExternalLink } from "lucide-react";
import StatCard from "@/components/StatCard";
import SkillBar from "@/components/SkillBar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import DailyStreak from "@/components/DailyStreak";
import ProgressCharts from "@/components/ProgressCharts";
import ShareableResultCard from "@/components/ShareableResultCard";

interface AIRecommendation {
  summary: string;
  top_skills_to_learn: {
    skill: string;
    why: string;
    priority: "critical" | "high" | "medium";
    time_to_learn: string;
    resources: { name: string; type: string; url?: string }[];
    action_steps: string[];
  }[];
  quick_wins: string[];
  thirty_day_plan: { week1: string; week2: string; week3: string; week4: string };
  target_companies: string[];
  estimated_improvement: string;
}

function calculatePlacement(profile: any, quizScores: any[], commScore: number) {
  const cgpaWeight = 0.2;
  const dsaWeight = 0.15;
  const aptWeight = 0.15;
  const projectWeight = 0.1;
  const internshipWeight = 0.1;
  const quizWeight = 0.15;
  const commWeight = 0.15;

  const cgpaNorm = (profile.cgpa / 10) * 100;
  const projectNorm = Math.min(100, profile.num_projects * 15);
  const internshipNorm = Math.min(100, profile.internship_experience * 30);

  const dsaQuiz = quizScores.find(s => s.category === "Data Structures");
  const dsaScore = dsaQuiz ? (dsaQuiz.score / dsaQuiz.total_questions) * 100 : profile.dsa_score;

  const aptQuiz = quizScores.find(s => s.category === "Aptitude");
  const aptScore = aptQuiz ? (aptQuiz.score / aptQuiz.total_questions) * 100 : profile.aptitude_score;

  const totalQuizScore = quizScores.length > 0
    ? quizScores.reduce((acc, s) => acc + (s.score / s.total_questions) * 100, 0) / quizScores.length
    : (profile.dsa_score + profile.aptitude_score) / 2;

  const probability =
    cgpaNorm * cgpaWeight +
    dsaScore * dsaWeight +
    aptScore * aptWeight +
    projectNorm * projectWeight +
    internshipNorm * internshipWeight +
    totalQuizScore * quizWeight +
    commScore * commWeight;

  return Math.min(99, Math.max(5, Math.round(probability)));
}

function getSkillGaps(profile: any, quizScores: any[], commScore: number) {
  const gaps: { skill: string; level: string; suggestion: string; resources: string[]; severity: "high" | "medium" | "low" }[] = [];

  const dsaQuiz = quizScores.find(s => s.category === "Data Structures");
  const dsaScore = dsaQuiz ? Math.round((dsaQuiz.score / dsaQuiz.total_questions) * 100) : profile.dsa_score;

  const aptQuiz = quizScores.find(s => s.category === "Aptitude");
  const aptScore = aptQuiz ? Math.round((aptQuiz.score / aptQuiz.total_questions) * 100) : profile.aptitude_score;

  if (dsaScore < 50) {
    gaps.push({ skill: "Data Structures & Algorithms", level: `${dsaScore}%${dsaQuiz ? " (Quiz)" : " (Self-assessed)"}`, suggestion: "Practice DSA daily on competitive platforms", resources: ["LeetCode", "GeeksforGeeks", "HackerRank"], severity: "high" });
  }
  if (aptScore < 50) {
    gaps.push({ skill: "Aptitude", level: `${aptScore}%${aptQuiz ? " (Quiz)" : " (Self-assessed)"}`, suggestion: "Solve aptitude problems regularly", resources: ["IndiaBix", "PrepInsta", "Aptitude Books"], severity: "high" });
  }
  if (commScore < 50) {
    gaps.push({ skill: "Communication", level: `${commScore}%`, suggestion: "Practice speaking and presentations", resources: ["Toastmasters", "YouTube Channels", "Mock Interviews"], severity: "high" });
  }
  if (profile.cgpa < 7) {
    gaps.push({ skill: "Academics (CGPA)", level: `${profile.cgpa}/10`, suggestion: "Focus on core subjects and improve grades", resources: ["NPTEL", "Coursera", "University Resources"], severity: profile.cgpa < 6 ? "high" : "medium" });
  }
  if (profile.num_projects < 3) {
    gaps.push({ skill: "Projects", level: `${profile.num_projects} projects`, suggestion: "Build real-world projects to showcase skills", resources: ["GitHub", "Kaggle", "DevPost Hackathons"], severity: "medium" });
  }
  if (profile.internship_experience < 1) {
    gaps.push({ skill: "Internship Experience", level: "No internships", suggestion: "Apply for internships to gain industry experience", resources: ["Internshala", "LinkedIn", "AngelList"], severity: "medium" });
  }

  const progQuiz = quizScores.find(s => s.category === "Programming");
  if (progQuiz && (progQuiz.score / progQuiz.total_questions) < 0.5) {
    gaps.push({ skill: "Programming Quiz", level: `${progQuiz.score}/${progQuiz.total_questions}`, suggestion: "Revise programming concepts and practice coding", resources: ["HackerRank", "Codecademy", "freeCodeCamp"], severity: "medium" });
  }

  if (profile.programming_skills.length < 3) {
    gaps.push({ skill: "Programming Languages", level: `${profile.programming_skills.length} languages`, suggestion: "Learn at least 2-3 programming languages", resources: ["freeCodeCamp", "Codecademy", "W3Schools"], severity: "low" });
  }

  return gaps;
}

export default function DashboardPage() {
  const { profile, profileId, quizScores, commResult } = useAppContext();
  const [showRating, setShowRating] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [aiRecs, setAiRecs] = useState<AIRecommendation | null>(null);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [recsError, setRecsError] = useState<string | null>(null);

  useEffect(() => {
    if (!profileId) return;
    // Check if user already rated
    supabase.from("app_ratings").select("id").eq("profile_id", profileId).maybeSingle().then(({ data }) => {
      if (data) {
        setHasRated(true);
      } else {
        // Show rating dialog after 2 seconds
        const timer = setTimeout(() => setShowRating(true), 2000);
        return () => clearTimeout(timer);
      }
    });
  }, [profileId]);

  const submitRating = async () => {
    if (!selectedRating || !profileId) return;
    setSubmittingRating(true);
    try {
      const { error } = await supabase.from("app_ratings").insert({
        profile_id: profileId,
        rating: selectedRating,
      });
      if (error) throw error;
      setHasRated(true);
      setShowRating(false);
      toast.success("Thank you for your rating!");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit rating");
    } finally {
      setSubmittingRating(false);
    }
  };

  const fetchAIRecommendations = async () => {
    if (!profile || loadingRecs) return;
    setLoadingRecs(true);
    setRecsError(null);
    try {
      const commScoreVal = commResult?.overall_score ?? profile.communication_rating * 10;
      const prob = calculatePlacement(profile, quizScores, commScoreVal);
      const gapsList = getSkillGaps(profile, quizScores, commScoreVal);
      const { data, error } = await supabase.functions.invoke("ai-skill-recommendations", {
        body: { profile, quizScores, commScore: commScoreVal, placementProb: prob, gaps: gapsList },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setAiRecs(data);
    } catch (err: any) {
      setRecsError(err.message || "Failed to get recommendations");
      toast.error(err.message || "Failed to get AI recommendations");
    } finally {
      setLoadingRecs(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-pattern flex items-center justify-center">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-md mx-auto space-y-6 animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">No Data Yet</h1>
            <p className="text-muted-foreground">Complete your profile to see your placement prediction. Quiz and voice analysis are optional.</p>
            <Button asChild className="gradient-primary text-primary-foreground shadow-glow h-12 px-8 rounded-xl">
              <Link to="/profile">Create Profile <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const commScore = commResult?.overall_score ?? profile.communication_rating * 10;
  const placementProb = calculatePlacement(profile, quizScores, commScore);
  const placed = placementProb >= 60;
  const gaps = getSkillGaps(profile, quizScores, commScore);

  const dsaQuiz = quizScores.find(s => s.category === "Data Structures");
  const dsaDisplayScore = dsaQuiz ? Math.round((dsaQuiz.score / dsaQuiz.total_questions) * 100) : profile.dsa_score;
  const dsaSource = dsaQuiz ? "Quiz" : "Self-assessed";

  const aptQuiz = quizScores.find(s => s.category === "Aptitude");
  const aptDisplayScore = aptQuiz ? Math.round((aptQuiz.score / aptQuiz.total_questions) * 100) : profile.aptitude_score;
  const aptSource = aptQuiz ? "Quiz" : "Self-assessed";

  const totalQuizPct = quizScores.length > 0
    ? Math.round(quizScores.reduce((a, s) => a + (s.score / s.total_questions) * 100, 0) / quizScores.length)
    : 0;

  return (
    <div className="min-h-screen bg-pattern">
      <div className="container mx-auto px-4 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-primary shadow-glow flex items-center justify-center">
            <Brain className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {profile.name}</p>
          </div>
        </div>

        {/* Placement Prediction Banner */}
        <div className={`card-elevated p-6 md:p-8 mb-8 animate-fade-in relative overflow-hidden ${
          placed ? "border-success/30" : "border-destructive/30"
        }`}>
          <div className={`absolute inset-0 ${placed ? "bg-success/5" : "bg-destructive/5"}`} />
          <div className="relative flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-5">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${placed ? "gradient-accent shadow-glow-accent" : "gradient-warm"}`}>
                {placed ? <CheckCircle2 className="w-8 h-8 text-white" /> : <AlertTriangle className="w-8 h-8 text-white" />}
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">AI Placement Prediction</p>
                <p className={`text-2xl md:text-3xl font-display font-bold ${placed ? "text-success" : "text-destructive"}`}>
                  {placed ? "Likely Placed" : "Needs Improvement"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Probability</p>
              <p className={`text-5xl md:text-6xl font-display font-bold ${placed ? "text-gradient-accent" : "text-gradient"}`}>
                {placementProb}%
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="CGPA" value={profile.cgpa.toFixed(1)} subtitle="out of 10" icon={<TrendingUp className="w-5 h-5" />} variant="primary" />
          <StatCard title="Quiz Score" value={quizScores.length > 0 ? `${totalQuizPct}%` : "—"} subtitle={quizScores.length > 0 ? `${quizScores.length} categories` : "Not taken"} icon={<BookOpen className="w-5 h-5" />} variant="accent" />
          <StatCard title="Communication" value={`${commScore}%`} icon={<Mic className="w-5 h-5" />} variant="warning" />
          <StatCard title="Projects" value={profile.num_projects} subtitle={`${profile.internship_experience} internships`} icon={<Target className="w-5 h-5" />} />
        </div>

        {/* Streak + Shareable Card */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <DailyStreak />
          <ShareableResultCard
            name={profile.name}
            placementProb={placementProb}
            cgpa={profile.cgpa}
            quizPct={totalQuizPct}
            commScore={commScore}
          />
        </div>

        {/* Progress Charts */}
        <div className="mb-8">
          <ProgressCharts profileId={profileId} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Skill Levels */}
          <div className="card-elevated p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-primary" />
              <h2 className="font-display font-semibold text-lg text-foreground">Skill Levels</h2>
            </div>
            <div className="space-y-5">
              <SkillBar label="CGPA" value={profile.cgpa} max={10} color={profile.cgpa >= 7 ? "success" : profile.cgpa >= 5 ? "warning" : "destructive"} />
              <SkillBar label={`DSA (${dsaSource})`} value={dsaDisplayScore} max={100} color={dsaDisplayScore >= 60 ? "success" : dsaDisplayScore >= 40 ? "warning" : "destructive"} />
              <SkillBar label={`Aptitude (${aptSource})`} value={aptDisplayScore} max={100} color={aptDisplayScore >= 60 ? "success" : aptDisplayScore >= 40 ? "warning" : "destructive"} />
              <SkillBar label="Communication" value={commScore} max={100} color={commScore >= 60 ? "accent" : commScore >= 40 ? "warning" : "destructive"} />
              {quizScores.length > 0 && (
                <SkillBar label="Quiz Average" value={totalQuizPct} max={100} color={totalQuizPct >= 60 ? "primary" : totalQuizPct >= 40 ? "warning" : "destructive"} />
              )}
            </div>
          </div>

          {/* Quiz Breakdown */}
          <div className="card-elevated p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="w-5 h-5 text-accent" />
              <h2 className="font-display font-semibold text-lg text-foreground">Quiz Breakdown</h2>
            </div>
            {quizScores.length > 0 ? (
              <div className="space-y-5">
                {quizScores.map((s) => (
                  <SkillBar key={s.category} label={s.category} value={s.score} max={s.total_questions} color={(s.score / s.total_questions) >= 0.66 ? "success" : (s.score / s.total_questions) >= 0.33 ? "warning" : "destructive"} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">No quiz data yet</p>
                <Button asChild variant="outline" size="sm" className="rounded-xl">
                  <Link to="/quiz">Take Quiz</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Skill Gap Analysis */}
        {gaps.length > 0 && (
          <div className="mt-8 card-elevated p-6 md:p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-lg text-foreground">Skill Gap Analysis</h2>
                  <p className="text-xs text-muted-foreground">{gaps.length} area{gaps.length > 1 ? "s" : ""} to improve</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-destructive" /> Critical</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-warning" /> Medium</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-info" /> Low</span>
              </div>
            </div>

            {/* Overall gap score bar */}
            <div className="mt-4 mb-6 p-4 rounded-xl bg-secondary/40 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Readiness Score</span>
                <span className="text-sm font-bold text-foreground">{Math.max(0, 100 - gaps.reduce((a, g) => a + (g.severity === "high" ? 20 : g.severity === "medium" ? 10 : 5), 0))}%</span>
              </div>
              <Progress value={Math.max(0, 100 - gaps.reduce((a, g) => a + (g.severity === "high" ? 20 : g.severity === "medium" ? 10 : 5), 0))} className="h-2.5" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {gaps.map((gap, i) => {
                const severityConfig = {
                  high: { bg: "bg-destructive/5", border: "border-destructive/20", badge: "bg-destructive/10 text-destructive", icon: "🔴", barColor: "bg-destructive" },
                  medium: { bg: "bg-warning/5", border: "border-warning/20", badge: "bg-warning/10 text-warning", icon: "🟡", barColor: "bg-warning" },
                  low: { bg: "bg-info/5", border: "border-info/20", badge: "bg-info/10 text-info", icon: "🟢", barColor: "bg-info" },
                }[gap.severity];

                // Extract numeric value for progress bar
                const numMatch = gap.level.match(/(\d+)/);
                const numValue = numMatch ? parseInt(numMatch[1]) : 0;
                const maxValue = gap.level.includes("/10") ? 100 : 100;
                const progressValue = gap.level.includes("/10") ? numValue * 10 : numValue;

                return (
                  <div key={i} className={`group rounded-2xl p-5 border-2 transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${severityConfig.bg} ${severityConfig.border}`}>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <span className="text-lg mt-0.5">{severityConfig.icon}</span>
                        <div>
                          <h3 className="font-display font-semibold text-foreground leading-tight">{gap.skill}</h3>
                          <span className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mt-1.5 ${severityConfig.badge}`}>
                            {gap.severity} priority
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-mono text-muted-foreground bg-secondary/80 px-2.5 py-1 rounded-lg border border-border whitespace-nowrap">
                        {gap.level}
                      </span>
                    </div>

                    {/* Mini progress bar */}
                    {progressValue > 0 && (
                      <div className="mb-3">
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${severityConfig.barColor}`} style={{ width: `${Math.min(progressValue, 100)}%` }} />
                        </div>
                      </div>
                    )}

                    {/* Suggestion */}
                    <div className="flex items-start gap-2 mb-4 p-3 rounded-xl bg-background/50 border border-border/50">
                      <Lightbulb className="w-3.5 h-3.5 text-warning mt-0.5 shrink-0" />
                      <p className="text-sm text-muted-foreground leading-relaxed">{gap.suggestion}</p>
                    </div>

                    {/* Resources */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-2">Recommended Resources</p>
                      <div className="flex flex-wrap gap-1.5">
                        {gap.resources.map((r) => (
                          <span key={r} className="text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-1.5 rounded-lg font-medium border border-border/50 transition-colors cursor-default flex items-center gap-1">
                            <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action CTA */}
            <div className="mt-6 flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-3">
                <Rocket className="w-5 h-5 text-primary" />
                <p className="text-sm text-foreground font-medium">Get a personalized roadmap to fix your skill gaps</p>
              </div>
              <Button asChild size="sm" className="gradient-primary text-primary-foreground rounded-xl">
                <Link to="/career">View Roadmap <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
              </Button>
            </div>
          </div>
        )}

        {gaps.length === 0 && (
          <div className="mt-8 card-elevated bg-success/5 border-success/20 p-8 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h2 className="font-display font-semibold text-xl text-foreground">Excellent Profile!</h2>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">No major skill gaps detected. You're well-prepared for placement. Keep up the great work!</p>
            <Button asChild variant="outline" size="sm" className="mt-4 rounded-xl">
              <Link to="/career">Explore Career Paths <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
            </Button>
          </div>
        )}

        {/* AI-Powered Skill Recommendations */}
        <div className="mt-8 card-elevated p-6 md:p-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="font-display font-semibold text-lg text-foreground">AI Skill Recommendations</h2>
            </div>
            <Button
              onClick={fetchAIRecommendations}
              disabled={loadingRecs}
              className="gradient-primary text-primary-foreground rounded-xl shadow-glow"
              size="sm"
            >
              {loadingRecs ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</> : <><Sparkles className="w-4 h-4 mr-2" /> {aiRecs ? "Refresh" : "Get AI Recommendations"}</>}
            </Button>
          </div>

          {!aiRecs && !loadingRecs && !recsError && (
            <div className="text-center py-10 space-y-3">
              <Rocket className="w-12 h-12 text-muted-foreground/30 mx-auto" />
              <p className="text-muted-foreground">Click the button above to get personalized AI-powered skill recommendations based on your profile.</p>
            </div>
          )}

          {recsError && !loadingRecs && (
            <div className="text-center py-8 text-destructive">
              <AlertTriangle className="w-10 h-10 mx-auto mb-2 opacity-60" />
              <p className="text-sm">{recsError}</p>
            </div>
          )}

          {loadingRecs && (
            <div className="text-center py-12 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">AI is analyzing your profile and generating personalized recommendations...</p>
            </div>
          )}

          {aiRecs && !loadingRecs && (
            <div className="space-y-6 animate-fade-in">
              {/* Summary */}
              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5">
                <p className="text-sm text-foreground leading-relaxed">{aiRecs.summary}</p>
                {aiRecs.estimated_improvement && (
                  <p className="text-xs text-primary font-semibold mt-3 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" /> {aiRecs.estimated_improvement}
                  </p>
                )}
              </div>

              {/* Quick Wins */}
              {aiRecs.quick_wins?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-warning" /> Quick Wins
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {aiRecs.quick_wins.map((tip, i) => (
                      <div key={i} className="bg-warning/5 border border-warning/15 rounded-xl p-4">
                        <p className="text-sm text-foreground">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Skills to Learn */}
              {aiRecs.top_skills_to_learn?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-accent" /> Skills to Focus On
                  </h3>
                  <div className="space-y-4">
                    {aiRecs.top_skills_to_learn.map((skill, i) => (
                      <div key={i} className={`rounded-2xl p-5 border-2 ${
                        skill.priority === "critical" ? "bg-destructive/5 border-destructive/20" :
                        skill.priority === "high" ? "bg-warning/5 border-warning/20" :
                        "bg-primary/5 border-primary/20"
                      }`}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
                              skill.priority === "critical" ? "bg-destructive/10 text-destructive" :
                              skill.priority === "high" ? "bg-warning/10 text-warning" :
                              "bg-primary/10 text-primary"
                            }`}>{skill.priority}</span>
                            <h4 className="font-semibold text-foreground mt-2">{skill.skill}</h4>
                          </div>
                          <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded-lg">{skill.time_to_learn}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{skill.why}</p>

                        {/* Action Steps */}
                        {skill.action_steps?.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-semibold text-muted-foreground mb-1.5">Action Steps:</p>
                            <ol className="space-y-1">
                              {skill.action_steps.map((step, j) => (
                                <li key={j} className="text-xs text-muted-foreground flex items-start gap-2">
                                  <span className="font-bold text-primary shrink-0">{j + 1}.</span> {step}
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {/* Resources */}
                        <div className="flex flex-wrap gap-2">
                          {skill.resources?.map((r, j) => (
                            <span key={j} className="text-xs bg-secondary text-secondary-foreground px-3 py-1.5 rounded-lg font-medium flex items-center gap-1">
                              {r.name}
                              {r.url && <ExternalLink className="w-3 h-3 opacity-50" />}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 30-Day Plan */}
              {aiRecs.thirty_day_plan && (
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-primary" /> 30-Day Improvement Plan
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {Object.entries(aiRecs.thirty_day_plan).map(([week, plan], i) => (
                      <div key={week} className="bg-secondary/30 rounded-xl p-4 border border-border/50">
                        <p className="text-xs font-bold text-primary mb-2">Week {i + 1}</p>
                        <p className="text-sm text-muted-foreground">{plan}</p>
                        <Progress value={(i + 1) * 25} className="h-1 mt-3" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Target Companies */}
              {aiRecs.target_companies?.length > 0 && (
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-semibold text-muted-foreground">Target Companies:</span>
                  {aiRecs.target_companies.map((c, i) => (
                    <span key={i} className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1.5 rounded-full">{c}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Rating Dialog */}
      <Dialog open={showRating && !hasRated} onOpenChange={setShowRating}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center font-display text-xl">Rate HireForge</DialogTitle>
            <DialogDescription className="text-center">
              How was your experience? Your feedback helps us improve!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-2 py-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setSelectedRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-10 h-10 transition-colors ${
                    star <= (hoveredRating || selectedRating)
                      ? "fill-warning text-warning"
                      : "text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
          </div>
          {selectedRating > 0 && (
            <p className="text-center text-sm text-muted-foreground">
              {selectedRating === 5 ? "Amazing! 🎉" : selectedRating === 4 ? "Great! 😊" : selectedRating === 3 ? "Good 👍" : selectedRating === 2 ? "Could be better 🤔" : "We'll improve! 💪"}
            </p>
          )}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowRating(false)} className="flex-1 rounded-xl">
              Skip
            </Button>
            <Button
              onClick={submitRating}
              disabled={!selectedRating || submittingRating}
              className="flex-1 gradient-primary text-primary-foreground rounded-xl shadow-glow"
            >
              {submittingRating ? "Submitting..." : "Submit Rating"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
