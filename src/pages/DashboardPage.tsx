import { useAppContext } from "@/context/AppContext";
import { Brain, BookOpen, Mic, TrendingUp, AlertTriangle, CheckCircle2, Lightbulb, ExternalLink } from "lucide-react";
import StatCard from "@/components/StatCard";
import SkillBar from "@/components/SkillBar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function calculatePlacement(profile: any, quizScores: any[], commScore: number) {
  // Weighted scoring model simulating ML prediction
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

  const totalQuizScore = quizScores.length > 0
    ? quizScores.reduce((acc, s) => acc + (s.score / s.total_questions) * 100, 0) / quizScores.length
    : 50;

  const probability =
    cgpaNorm * cgpaWeight +
    profile.dsa_score * dsaWeight +
    profile.aptitude_score * aptWeight +
    projectNorm * projectWeight +
    internshipNorm * internshipWeight +
    totalQuizScore * quizWeight +
    commScore * commWeight;

  return Math.min(99, Math.max(5, Math.round(probability)));
}

function getSkillGaps(profile: any, quizScores: any[], commScore: number) {
  const gaps: { skill: string; level: string; suggestion: string; resources: string[]; severity: "high" | "medium" | "low" }[] = [];

  if (profile.dsa_score < 50) {
    gaps.push({ skill: "Data Structures & Algorithms", level: `${profile.dsa_score}%`, suggestion: "Practice DSA daily on competitive platforms", resources: ["LeetCode", "GeeksforGeeks", "HackerRank"], severity: "high" });
  }
  if (profile.aptitude_score < 50) {
    gaps.push({ skill: "Aptitude", level: `${profile.aptitude_score}%`, suggestion: "Solve aptitude problems regularly", resources: ["IndiaBix", "PrepInsta", "Aptitude Books"], severity: "high" });
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

  const dsQuiz = quizScores.find(s => s.category === "Data Structures");
  if (dsQuiz && (dsQuiz.score / dsQuiz.total_questions) < 0.5) {
    gaps.push({ skill: "DS Quiz Performance", level: `${dsQuiz.score}/${dsQuiz.total_questions}`, suggestion: "Revise data structure concepts thoroughly", resources: ["Striver's SDE Sheet", "Abdul Bari YouTube", "CLRS Book"], severity: "medium" });
  }

  if (profile.programming_skills.length < 3) {
    gaps.push({ skill: "Programming Languages", level: `${profile.programming_skills.length} languages`, suggestion: "Learn at least 2-3 programming languages", resources: ["freeCodeCamp", "Codecademy", "W3Schools"], severity: "low" });
  }

  return gaps;
}

export default function DashboardPage() {
  const { profile, quizScores, commResult } = useAppContext();

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">No Data Yet</h1>
          <p className="text-muted-foreground">Complete your profile to see your placement prediction. Quiz and voice analysis are optional.</p>
          <Button asChild className="gradient-primary text-primary-foreground">
            <Link to="/profile">Create Profile</Link>
          </Button>
        </div>
      </div>
    );
  }

  const commScore = commResult?.overall_score ?? profile.communication_rating * 10;
  const placementProb = calculatePlacement(profile, quizScores, commScore);
  const placed = placementProb >= 60;
  const gaps = getSkillGaps(profile, quizScores, commScore);

  const totalQuizPct = quizScores.length > 0
    ? Math.round(quizScores.reduce((a, s) => a + (s.score / s.total_questions) * 100, 0) / quizScores.length)
    : 0;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Dashboard — {profile.name}</h1>
          <p className="text-sm text-muted-foreground">Your placement analysis and recommendations</p>
        </div>
      </div>

      {/* Placement Prediction Banner */}
      <div className={`rounded-xl p-6 mb-8 animate-fade-in ${placed ? "bg-success/10 border border-success/20" : "bg-destructive/10 border border-destructive/20"}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${placed ? "bg-success" : "bg-destructive"}`}>
              {placed ? <CheckCircle2 className="w-7 h-7 text-success-foreground" /> : <AlertTriangle className="w-7 h-7 text-destructive-foreground" />}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Placement Prediction</p>
              <p className={`text-2xl font-display font-bold ${placed ? "text-success" : "text-destructive"}`}>{placed ? "Likely Placed" : "Needs Improvement"}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Probability</p>
            <p className={`text-4xl font-display font-bold ${placed ? "text-success" : "text-destructive"}`}>{placementProb}%</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="CGPA" value={profile.cgpa.toFixed(1)} subtitle="out of 10" icon={<TrendingUp className="w-5 h-5" />} variant="primary" />
        <StatCard title="Quiz Score" value={`${totalQuizPct}%`} subtitle={`${quizScores.length} categories`} icon={<BookOpen className="w-5 h-5" />} variant="accent" />
        <StatCard title="Communication" value={`${commScore}%`} icon={<Mic className="w-5 h-5" />} variant="warning" />
        <StatCard title="Projects" value={profile.num_projects} subtitle={`${profile.internship_experience} internships`} icon={<Brain className="w-5 h-5" />} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skill Levels */}
        <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
          <h2 className="font-display font-semibold text-lg mb-5 text-foreground">Skill Levels</h2>
          <div className="space-y-4">
            <SkillBar label="CGPA" value={profile.cgpa} max={10} color={profile.cgpa >= 7 ? "success" : profile.cgpa >= 5 ? "warning" : "destructive"} />
            <SkillBar label="DSA Knowledge" value={profile.dsa_score} max={100} color={profile.dsa_score >= 60 ? "success" : profile.dsa_score >= 40 ? "warning" : "destructive"} />
            <SkillBar label="Aptitude" value={profile.aptitude_score} max={100} color={profile.aptitude_score >= 60 ? "success" : profile.aptitude_score >= 40 ? "warning" : "destructive"} />
            <SkillBar label="Communication" value={commScore} max={100} color={commScore >= 60 ? "accent" : commScore >= 40 ? "warning" : "destructive"} />
            <SkillBar label="Quiz Average" value={totalQuizPct} max={100} color={totalQuizPct >= 60 ? "primary" : totalQuizPct >= 40 ? "warning" : "destructive"} />
          </div>
        </div>

        {/* Quiz Breakdown */}
        <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
          <h2 className="font-display font-semibold text-lg mb-5 text-foreground">Quiz Breakdown</h2>
          {quizScores.length > 0 ? (
            <div className="space-y-4">
              {quizScores.map((s) => (
                <SkillBar key={s.category} label={s.category} value={s.score} max={s.total_questions} color={(s.score / s.total_questions) >= 0.66 ? "success" : (s.score / s.total_questions) >= 0.33 ? "warning" : "destructive"} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-3">No quiz data yet</p>
              <Button asChild variant="outline" size="sm"><Link to="/quiz">Take Quiz</Link></Button>
            </div>
          )}
        </div>
      </div>

      {/* Skill Gap Analysis & Recommendations */}
      {gaps.length > 0 && (
        <div className="mt-8 bg-card rounded-xl border border-border p-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-5">
            <Lightbulb className="w-5 h-5 text-warning" />
            <h2 className="font-display font-semibold text-lg text-foreground">Skill Gap Analysis & Recommendations</h2>
          </div>
          <div className="space-y-4">
            {gaps.map((gap, i) => (
              <div key={i} className={`rounded-xl p-4 border ${
                gap.severity === "high" ? "bg-destructive/5 border-destructive/15" :
                gap.severity === "medium" ? "bg-warning/5 border-warning/15" :
                "bg-info/5 border-info/15"
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${
                      gap.severity === "high" ? "bg-destructive/10 text-destructive" :
                      gap.severity === "medium" ? "bg-warning/10 text-warning" :
                      "bg-info/10 text-info"
                    }`}>{gap.severity} priority</span>
                    <h3 className="font-semibold text-foreground mt-1">{gap.skill}</h3>
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">{gap.level}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">💡 {gap.suggestion}</p>
                <div className="flex flex-wrap gap-2">
                  {gap.resources.map((r) => (
                    <span key={r} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md">{r}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {gaps.length === 0 && (
        <div className="mt-8 bg-success/5 rounded-xl border border-success/20 p-6 text-center animate-fade-in">
          <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
          <h2 className="font-display font-semibold text-lg text-foreground">Excellent Profile!</h2>
          <p className="text-muted-foreground">No major skill gaps detected. Keep up the great work!</p>
        </div>
      )}
    </div>
  );
}
