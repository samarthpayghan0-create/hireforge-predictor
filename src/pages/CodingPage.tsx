import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Code, Play, CheckCircle2, XCircle, Loader2, ChevronRight, ChevronLeft,
  Clock, Zap, Target, RefreshCw, AlertTriangle
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
}

interface EvalResult {
  is_correct: boolean;
  score: number;
  test_results: { input: string; expected: string; actual: string; passed: boolean }[];
  execution_time_estimate_ms: number;
  feedback: string;
  suggestions: string[];
  complexity: { time: string; space: string };
}

const LANGUAGES = [
  { id: "python", label: "Python", template: "def solution():\n    # Write your code here\n    pass\n" },
  { id: "java", label: "Java", template: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}\n" },
  { id: "cpp", label: "C++", template: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}\n" },
  { id: "javascript", label: "JavaScript", template: "function solution() {\n    // Write your code here\n}\n" },
];

const DIFF_COLORS: Record<string, string> = {
  easy: "bg-success/10 text-success",
  medium: "bg-warning/10 text-warning",
  hard: "bg-destructive/10 text-destructive",
};

export default function CodingPage() {
  const { profileId } = useAppContext();
  const { user } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(LANGUAGES[0].template);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState<EvalResult | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    supabase.from("coding_problems").select("*").order("difficulty").then(({ data }) => {
      setProblems((data as any) || []);
      setLoading(false);
    });
  }, []);

  const selectProblem = (p: Problem) => {
    setSelectedProblem(p);
    setResult(null);
    const lang = LANGUAGES.find((l) => l.id === language);
    setCode(lang?.template || "");
  };

  const changeLanguage = (langId: string) => {
    setLanguage(langId);
    const lang = LANGUAGES.find((l) => l.id === langId);
    setCode(lang?.template || "");
    setResult(null);
  };

  const submitCode = async () => {
    if (!selectedProblem || !code.trim()) return;
    setEvaluating(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("evaluate-code", {
        body: {
          code,
          language,
          problemTitle: selectedProblem.title,
          problemDescription: selectedProblem.description,
          sampleInput: selectedProblem.sample_input,
          sampleOutput: selectedProblem.sample_output,
          testCases: selectedProblem.test_cases,
          problemId: selectedProblem.id,
          profileId: profileId || null,
          userId: user?.id || null,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data);
      toast.success(data.is_correct ? "All tests passed! 🎉" : "Some tests failed. Check feedback.");
    } catch (err: any) {
      toast.error(err.message || "Failed to evaluate code");
    } finally {
      setEvaluating(false);
    }
  };

  const filtered = filter === "all" ? problems : problems.filter((p) => p.difficulty === filter);

  // Problem list view
  if (!selectedProblem) {
    return (
      <div className="min-h-screen bg-pattern">
        <div className="container mx-auto px-4 lg:px-8 py-10 max-w-5xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl gradient-primary shadow-glow flex items-center justify-center">
              <Code className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Coding Practice</h1>
              <p className="text-muted-foreground">Solve problems and improve your coding skills</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6">
            {["all", "easy", "medium", "hard"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === f ? "gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)} {f !== "all" && `(${problems.filter((p) => p.difficulty === f).length})`}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" /></div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => selectProblem(p)}
                  className="card-interactive p-5 text-left"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{p.title}</h3>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${DIFF_COLORS[p.difficulty]}`}>
                      {p.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                  <span className="text-xs text-primary mt-2 inline-block">{p.category}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Problem solving view
  return (
    <div className="min-h-screen bg-pattern">
      <div className="container mx-auto px-4 lg:px-8 py-6 max-w-6xl">
        <Button variant="ghost" onClick={() => { setSelectedProblem(null); setResult(null); }} className="mb-4 rounded-xl">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Problems
        </Button>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Problem description */}
          <div className="card-elevated p-6 space-y-4">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-display font-bold text-foreground">{selectedProblem.title}</h2>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${DIFF_COLORS[selectedProblem.difficulty]}`}>
                {selectedProblem.difficulty}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{selectedProblem.description}</p>
            <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Sample Input</p>
                <code className="text-sm text-foreground font-mono">{selectedProblem.sample_input}</code>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Sample Output</p>
                <code className="text-sm text-foreground font-mono">{selectedProblem.sample_output}</code>
              </div>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-4 animate-fade-in">
                <div className={`flex items-center gap-3 p-4 rounded-xl ${result.is_correct ? "bg-success/10 border border-success/20" : "bg-destructive/10 border border-destructive/20"}`}>
                  {result.is_correct ? <CheckCircle2 className="w-6 h-6 text-success" /> : <XCircle className="w-6 h-6 text-destructive" />}
                  <div>
                    <p className={`font-semibold ${result.is_correct ? "text-success" : "text-destructive"}`}>
                      {result.is_correct ? "Accepted" : "Wrong Answer"}
                    </p>
                    <p className="text-xs text-muted-foreground">Score: {result.score}/100</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs text-muted-foreground">Time: {result.complexity?.time}</p>
                    <p className="text-xs text-muted-foreground">Space: {result.complexity?.space}</p>
                  </div>
                </div>

                {result.test_results?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">Test Cases</p>
                    {result.test_results.map((t, i) => (
                      <div key={i} className={`flex items-center gap-2 p-3 rounded-lg text-sm ${t.passed ? "bg-success/5" : "bg-destructive/5"}`}>
                        {t.passed ? <CheckCircle2 className="w-4 h-4 text-success" /> : <XCircle className="w-4 h-4 text-destructive" />}
                        <span className="text-muted-foreground">Test {i + 1}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-primary/5 rounded-xl p-4">
                  <p className="text-sm font-semibold text-foreground mb-2">Feedback</p>
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
          </div>

          {/* Code editor */}
          <div className="card-elevated p-6 space-y-4">
            <div className="flex items-center gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.id}
                  onClick={() => changeLanguage(l.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    language === l.id ? "gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="font-mono text-sm min-h-[400px] bg-secondary/30 rounded-xl resize-none"
              spellCheck={false}
            />

            <Button onClick={submitCode} disabled={evaluating || !code.trim()} className="w-full gradient-accent text-accent-foreground h-12 rounded-xl">
              {evaluating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Evaluating...</> : <><Play className="w-4 h-4 mr-2" /> Run & Evaluate</>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
