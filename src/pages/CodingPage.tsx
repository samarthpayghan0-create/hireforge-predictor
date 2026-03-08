import { useState, useEffect, useCallback } from "react";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import Editor from "@monaco-editor/react";
import {
  Code, Play, CheckCircle2, XCircle, Loader2, ChevronLeft,
  Zap, Trophy, Medal, Crown, Star, Timer, ArrowRight, Users
} from "lucide-react";

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  sample_input: string;
  sample_output: string;
  test_cases: any[];
  category: string;
  constraints: string;
  company_tags: string[];
  points: number;
}

interface EvalResult {
  is_correct: boolean;
  score: number;
  test_results: { input: string; expected: string; actual: string; passed: boolean }[];
  execution_time_estimate_ms: number;
  feedback: string;
  suggestions: string[];
  complexity: { time: string; space: string };
  points_earned?: number;
  time_bonus?: number;
}

interface LeaderboardEntry {
  id: string;
  username: string;
  total_score: number;
  problems_solved: number;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  preferred_language: string;
  success_rate: number;
  user_id: string;
}

const LANGUAGES = [
  { id: "python", label: "Python", monacoId: "python", icon: "🐍", template: "def solution():\n    # Write your code here\n    pass\n\n# Call your solution\nsolution()\n" },
  { id: "java", label: "Java", monacoId: "java", icon: "☕", template: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}\n" },
  { id: "cpp", label: "C++", monacoId: "cpp", icon: "⚡", template: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}\n" },
  { id: "javascript", label: "JavaScript", monacoId: "javascript", icon: "🌐", template: "function solution() {\n    // Write your code here\n}\n\nsolution();\n" },
];

const DIFF_COLORS: Record<string, string> = {
  easy: "bg-success/10 text-success border-success/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  hard: "bg-destructive/10 text-destructive border-destructive/20",
};

const DIFF_POINTS: Record<string, number> = { easy: 10, medium: 20, hard: 30 };

const RANK_ICONS = [
  <Crown className="w-5 h-5 text-warning" />,
  <Medal className="w-5 h-5 text-muted-foreground" />,
  <Medal className="w-5 h-5 text-warning/60" />,
];

export default function CodingPage() {
  const { profileId, profile } = useAppContext();
  const { user } = useAuth();

  const [phase, setPhase] = useState<"select-lang" | "problems" | "solve">("select-lang");
  const [language, setLanguage] = useState("");
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState<EvalResult | null>(null);
  const [filter, setFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [failedAttempts, setFailedAttempts] = useState<Record<string, number>>({});
  const [showSolution, setShowSolution] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Load problems
  useEffect(() => {
    supabase.from("coding_problems").select("*").order("difficulty").then(({ data }) => {
      setProblems((data as any) || []);
    });
  }, []);

  // Load & subscribe to leaderboard
  const fetchLeaderboard = useCallback(async () => {
    const { data } = await supabase
      .from("coding_leaderboard")
      .select("*")
      .order("total_score", { ascending: false })
      .limit(50);
    setLeaderboard((data as any) || []);
  }, []);

  useEffect(() => {
    fetchLeaderboard();
    const channel = supabase
      .channel("leaderboard-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "coding_leaderboard" }, () => {
        fetchLeaderboard();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchLeaderboard]);

  // Load user stats
  useEffect(() => {
    if (!user) return;
    supabase.from("coding_leaderboard").select("total_score, problems_solved").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data) {
        setTotalScore((data as any).total_score || 0);
        setSolvedCount((data as any).problems_solved || 0);
      }
    });
  }, [user]);

  // Timer
  useEffect(() => {
    if (phase !== "solve" || !startTime) return;
    const interval = setInterval(() => setElapsedTime(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(interval);
  }, [phase, startTime]);

  const selectLanguage = (langId: string) => {
    setLanguage(langId);
    setPhase("problems");
  };

  const selectProblem = (p: Problem) => {
    setSelectedProblem(p);
    setResult(null);
    setShowSolution(false);
    const lang = LANGUAGES.find((l) => l.id === language);
    setCode(lang?.template || "");
    setStartTime(Date.now());
    setElapsedTime(0);
    setPhase("solve");
  };

  const submitCode = async () => {
    if (!selectedProblem || !code.trim()) return;
    setEvaluating(true);
    setResult(null);
    try {
      const username = profile?.name || user?.email?.split("@")[0] || "Anonymous";
      const { data, error } = await supabase.functions.invoke("evaluate-code", {
        body: {
          code, language,
          problemTitle: selectedProblem.title,
          problemDescription: selectedProblem.description,
          sampleInput: selectedProblem.sample_input,
          sampleOutput: selectedProblem.sample_output,
          testCases: selectedProblem.test_cases,
          problemId: selectedProblem.id,
          profileId: profileId || null,
          userId: user?.id || null,
          username,
          difficulty: selectedProblem.difficulty,
          points: selectedProblem.points || DIFF_POINTS[selectedProblem.difficulty],
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data);
      if (data.is_correct) {
        setTotalScore((s) => s + (data.points_earned || 0));
        setSolvedCount((s) => s + 1);
        toast.success(`🎉 Correct! +${data.points_earned || 0} points${data.time_bonus ? ` (includes ${data.time_bonus} speed bonus!)` : ""}`);
      } else {
        const problemId = selectedProblem!.id;
        setFailedAttempts((prev) => ({ ...prev, [problemId]: (prev[problemId] || 0) + 1 }));
        const attempts = (failedAttempts[problemId] || 0) + 1;
        if (attempts >= 2) {
          toast.error("Not quite right. Solution is now unlocked! 🔓");
        } else {
          toast.error(`Not quite right. ${2 - attempts} more attempt(s) to unlock the solution.`);
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to evaluate code");
    } finally {
      setEvaluating(false);
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const categories = [...new Set(problems.map((p) => p.category))];
  const filtered = problems
    .filter((p) => filter === "all" || p.difficulty === filter)
    .filter((p) => catFilter === "all" || p.category === catFilter);

  const myRank = leaderboard.findIndex((e) => e.user_id === user?.id) + 1;

  // ========== LANGUAGE SELECT ==========
  if (phase === "select-lang") {
    return (
      <div className="min-h-screen bg-pattern">
        <div className="container mx-auto px-4 lg:px-8 py-10 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl gradient-primary shadow-glow flex items-center justify-center">
              <Code className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Coding Challenge Game</h1>
              <p className="text-muted-foreground">Solve MAANG-style problems and climb the leaderboard</p>
            </div>
            <Button variant="outline" onClick={() => setShowLeaderboard(!showLeaderboard)} className="rounded-xl gap-2">
              <Trophy className="w-4 h-4" /> Leaderboard
            </Button>
          </div>

          {showLeaderboard ? (
            <LeaderboardPanel leaderboard={leaderboard} userId={user?.id} onClose={() => setShowLeaderboard(false)} />
          ) : (
            <>
              {/* Stats banner */}
              {user && (
                <div className="card-elevated p-5 mb-8 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-6">
                    <div><p className="text-xs text-muted-foreground">Your Score</p><p className="text-2xl font-display font-bold text-gradient">{totalScore}</p></div>
                    <div><p className="text-xs text-muted-foreground">Solved</p><p className="text-2xl font-display font-bold text-foreground">{solvedCount}</p></div>
                    {myRank > 0 && <div><p className="text-xs text-muted-foreground">Rank</p><p className="text-2xl font-display font-bold text-warning">#{myRank}</p></div>}
                  </div>
                </div>
              )}

              <div className="card-elevated p-6 md:p-8 animate-fade-in">
                <h2 className="text-xl font-display font-bold text-foreground mb-2">Select Your Language</h2>
                <p className="text-sm text-muted-foreground mb-6">Choose the language you'll use for the coding challenges</p>

                <div className="grid grid-cols-2 gap-4">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => selectLanguage(lang.id)}
                      className="card-interactive p-6 text-center group"
                    >
                      <span className="text-4xl block mb-3">{lang.icon}</span>
                      <p className="text-lg font-display font-bold text-foreground">{lang.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">Used by Google, Amazon, Meta</p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ========== PROBLEM LIST ==========
  if (phase === "problems") {
    return (
      <div className="min-h-screen bg-pattern">
        <div className="container mx-auto px-4 lg:px-8 py-10 max-w-5xl">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => setPhase("select-lang")} className="rounded-xl">
              <ChevronLeft className="w-4 h-4 mr-1" /> Languages
            </Button>
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-display font-bold text-foreground">
                {LANGUAGES.find((l) => l.id === language)?.icon} {LANGUAGES.find((l) => l.id === language)?.label} Challenges
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-xl">
                <Star className="w-4 h-4 text-primary" />
                <span className="font-bold text-foreground text-sm">{totalScore} pts</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowLeaderboard(!showLeaderboard)} className="rounded-xl gap-1">
                <Trophy className="w-4 h-4" /> <span className="hidden sm:inline">Leaderboard</span>
              </Button>
            </div>
          </div>

          {showLeaderboard ? (
            <LeaderboardPanel leaderboard={leaderboard} userId={user?.id} onClose={() => setShowLeaderboard(false)} />
          ) : (
            <>
              {/* Filters */}
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex gap-1 bg-secondary/50 p-1 rounded-xl">
                  {["all", "easy", "medium", "hard"].map((f) => (
                    <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? "gradient-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                      {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                      {f !== "all" && <span className="ml-1 opacity-60">({problems.filter((p) => p.difficulty === f).length})</span>}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1 bg-secondary/50 p-1 rounded-xl overflow-x-auto">
                  <button onClick={() => setCatFilter("all")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${catFilter === "all" ? "gradient-accent text-accent-foreground" : "text-muted-foreground"}`}>All Topics</button>
                  {categories.map((c) => (
                    <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${catFilter === c ? "gradient-accent text-accent-foreground" : "text-muted-foreground"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {filtered.map((p) => (
                  <button key={p.id} onClick={() => selectProblem(p)} className="card-interactive p-5 text-left">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{p.title}</h3>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{p.points || DIFF_POINTS[p.difficulty]} pts</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full border ${DIFF_COLORS[p.difficulty]}`}>{p.difficulty}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{p.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-accent font-medium">{p.category}</span>
                      {p.company_tags?.slice(0, 3).map((t) => (
                        <span key={t} className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ========== SOLVE ==========
  const monacoLang = LANGUAGES.find((l) => l.id === language)?.monacoId || "python";

  return (
    <div className="min-h-screen bg-pattern">
      <div className="container mx-auto px-4 lg:px-8 py-4 max-w-[1400px]">
        {/* Top bar */}
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="sm" onClick={() => { setPhase("problems"); setResult(null); }} className="rounded-xl">
            <ChevronLeft className="w-4 h-4 mr-1" /> Problems
          </Button>
          <div className="flex-1 flex items-center gap-3">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${DIFF_COLORS[selectedProblem?.difficulty || "easy"]}`}>
              {selectedProblem?.difficulty} • {selectedProblem?.points || 10} pts
            </span>
            {selectedProblem?.company_tags?.map((t) => (
              <span key={t} className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full hidden sm:inline">{t}</span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Timer className="w-4 h-4" />
            <span className="font-mono">{formatTime(elapsedTime)}</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 rounded-xl">
            <Star className="w-4 h-4 text-primary" />
            <span className="font-bold text-sm text-foreground">{totalScore}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4" style={{ height: "calc(100vh - 120px)" }}>
          {/* Problem panel */}
          <div className="card-elevated p-5 overflow-y-auto">
            <h2 className="text-lg font-display font-bold text-foreground mb-3">{selectedProblem?.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{selectedProblem?.description}</p>

            {selectedProblem?.constraints && (
              <div className="bg-secondary/30 rounded-xl p-3 mb-4">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Constraints</p>
                <code className="text-xs text-foreground font-mono">{selectedProblem.constraints}</code>
              </div>
            )}

            <div className="bg-secondary/50 rounded-xl p-4 space-y-3 mb-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Example Input</p>
                <pre className="text-sm text-foreground font-mono bg-background/50 rounded-lg p-2 mt-1 overflow-x-auto">{selectedProblem?.sample_input}</pre>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Expected Output</p>
                <pre className="text-sm text-foreground font-mono bg-background/50 rounded-lg p-2 mt-1 overflow-x-auto">{selectedProblem?.sample_output}</pre>
              </div>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-4 animate-fade-in">
                <div className={`flex items-center gap-3 p-4 rounded-xl border ${result.is_correct ? "bg-success/10 border-success/20" : "bg-destructive/10 border-destructive/20"}`}>
                  {result.is_correct ? <CheckCircle2 className="w-6 h-6 text-success" /> : <XCircle className="w-6 h-6 text-destructive" />}
                  <div className="flex-1">
                    <p className={`font-semibold ${result.is_correct ? "text-success" : "text-destructive"}`}>
                      {result.is_correct ? "🎉 Accepted!" : "Wrong Answer"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Score: {result.score}/100 • {result.complexity?.time} time • {result.complexity?.space} space
                    </p>
                  </div>
                  {result.points_earned !== undefined && (
                    <div className="text-right">
                      <p className="text-lg font-bold text-success">+{result.points_earned}</p>
                      <p className="text-[10px] text-muted-foreground">points</p>
                    </div>
                  )}
                </div>

                {result.test_results?.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {result.test_results.map((t, i) => (
                      <div key={i} className={`flex items-center gap-2 p-2.5 rounded-lg text-sm ${t.passed ? "bg-success/5" : "bg-destructive/5"}`}>
                        {t.passed ? <CheckCircle2 className="w-4 h-4 text-success" /> : <XCircle className="w-4 h-4 text-destructive" />}
                        <span className="text-muted-foreground text-xs">Test {i + 1}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-primary/5 rounded-xl p-4">
                  <p className="text-sm font-semibold text-foreground mb-2">AI Feedback</p>
                  <p className="text-sm text-muted-foreground">{result.feedback}</p>
                  {result.suggestions?.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {result.suggestions.map((s, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <Zap className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" /> {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* View Solution - locked/unlocked state */}
            {selectedProblem && (
              <div className="mt-4">
                {(failedAttempts[selectedProblem.id] || 0) < 2 ? (
                  <Button
                    variant="outline"
                    disabled
                    className="w-full rounded-xl gap-2 border-muted/40 text-muted-foreground cursor-not-allowed opacity-60"
                  >
                    <Lock className="w-4 h-4" /> 🔒 View Solution
                    <span className="ml-1 text-xs">({2 - (failedAttempts[selectedProblem.id] || 0)} failed attempt{(2 - (failedAttempts[selectedProblem.id] || 0)) !== 1 ? 's' : ''} to unlock)</span>
                  </Button>
                ) : !showSolution ? (
                  <Button
                    variant="outline"
                    onClick={() => setShowSolution(true)}
                    className="w-full rounded-xl gap-2 border-warning/30 text-warning hover:bg-warning/10 animate-fade-in"
                  >
                    <Zap className="w-4 h-4" /> 🔓 View Solution
                  </Button>
                ) : (
                  <div className="bg-warning/5 border border-warning/20 rounded-xl p-4 space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-warning flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Reference Solution ({LANGUAGES.find(l => l.id === language)?.label})
                      </p>
                      <Button variant="ghost" size="sm" onClick={() => setShowSolution(false)} className="text-xs text-muted-foreground">Hide</Button>
                    </div>
                    <SolutionBlock problem={selectedProblem} language={language} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Code editor panel */}
          <div className="card-elevated flex flex-col overflow-hidden">
            {/* Language tabs */}
            <div className="flex items-center gap-1 p-3 border-b border-border bg-secondary/20">
              {LANGUAGES.map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    setLanguage(l.id);
                    setCode(LANGUAGES.find((la) => la.id === l.id)?.template || "");
                    setResult(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    language === l.id ? "gradient-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <span>{l.icon}</span> {l.label}
                </button>
              ))}
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                language={monacoLang}
                value={code}
                onChange={(v) => setCode(v || "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  lineNumbers: "on",
                  roundedSelection: true,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 4,
                  wordWrap: "on",
                  padding: { top: 12 },
                }}
              />
            </div>

            {/* Action bar */}
            <div className="p-3 border-t border-border bg-secondary/20 flex items-center gap-3">
              <Button onClick={submitCode} disabled={evaluating || !code.trim()} className="flex-1 gradient-accent text-accent-foreground h-11 rounded-xl font-semibold">
                {evaluating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Evaluating...</> : <><Play className="w-4 h-4 mr-2" /> Submit Solution</>}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== SOLUTION BLOCK COMPONENT ==========
const SOLUTION_TEMPLATES: Record<string, string> = {};

function SolutionBlock({ problem, language }: { problem: Problem; language: string }) {
  const [solution, setSolution] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cacheKey = `${problem.id}_${language}`;
    if (SOLUTION_TEMPLATES[cacheKey]) {
      setSolution(SOLUTION_TEMPLATES[cacheKey]);
      setLoading(false);
      return;
    }

    const generateSolution = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("evaluate-code", {
          body: {
            mode: "generate-solution",
            language,
            problemTitle: problem.title,
            problemDescription: problem.description,
            sampleInput: problem.sample_input,
            sampleOutput: problem.sample_output,
          },
        });
        if (error) throw error;
        const sol = data?.solution || "// Solution could not be generated";
        SOLUTION_TEMPLATES[cacheKey] = sol;
        setSolution(sol);
      } catch {
        setSolution("// Failed to generate solution. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    generateSolution();
  }, [problem.id, language]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-4 justify-center text-muted-foreground text-sm">
        <Loader2 className="w-4 h-4 animate-spin" /> Generating solution...
      </div>
    );
  }

  return (
    <pre className="text-sm text-foreground font-mono bg-background/80 rounded-lg p-4 overflow-x-auto whitespace-pre-wrap max-h-[400px] overflow-y-auto">
      {solution}
    </pre>
  );
}

// ========== LEADERBOARD COMPONENT ==========
function LeaderboardPanel({ leaderboard, userId, onClose }: { leaderboard: LeaderboardEntry[]; userId?: string; onClose: () => void }) {
  return (
    <div className="card-elevated p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-display font-bold text-foreground">Leaderboard</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="rounded-xl">Close</Button>
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center py-10">
          <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No entries yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-muted-foreground px-4 py-2">
            <span className="col-span-1">#</span>
            <span className="col-span-3">Player</span>
            <span className="col-span-2 text-center">Score</span>
            <span className="col-span-2 text-center">Solved</span>
            <span className="col-span-2 text-center">Rate</span>
            <span className="col-span-2 text-center">Lang</span>
          </div>

          {leaderboard.map((entry, i) => {
            const isMe = entry.user_id === userId;
            return (
              <div
                key={entry.id}
                className={`grid grid-cols-12 gap-2 items-center px-4 py-3 rounded-xl transition-all ${
                  isMe ? "bg-primary/10 border border-primary/20" : i < 3 ? "bg-secondary/50" : "hover:bg-secondary/30"
                }`}
              >
                <span className="col-span-1 flex items-center">
                  {i < 3 ? RANK_ICONS[i] : <span className="text-sm font-mono text-muted-foreground">{i + 1}</span>}
                </span>
                <span className="col-span-3 font-semibold text-sm text-foreground truncate flex items-center gap-1.5">
                  {entry.username}
                  {isMe && <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">You</span>}
                </span>
                <span className="col-span-2 text-center font-bold text-foreground">{entry.total_score}</span>
                <span className="col-span-2 text-center text-sm text-muted-foreground">
                  {entry.problems_solved}
                  <span className="text-[10px] ml-1 hidden sm:inline">({entry.easy_solved}E/{entry.medium_solved}M/{entry.hard_solved}H)</span>
                </span>
                <span className="col-span-2 text-center text-sm">
                  <span className={`font-medium ${entry.success_rate >= 70 ? "text-success" : entry.success_rate >= 40 ? "text-warning" : "text-destructive"}`}>
                    {entry.success_rate}%
                  </span>
                </span>
                <span className="col-span-2 text-center text-xs text-muted-foreground capitalize">{entry.preferred_language}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
