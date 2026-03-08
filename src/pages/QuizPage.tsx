import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { getShuffledQuestions, QuizQuestion } from "@/data/quizData";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BookOpen, ChevronRight, CheckCircle2, Settings2 } from "lucide-react";

type Difficulty = "medium" | "hard" | "mixed";
type QuestionCount = 20 | 30 | 50;

export default function QuizPage() {
  const { profileId, setQuizScores } = useAppContext();
  const navigate = useNavigate();

  // Setup state
  const [started, setStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [questionCount, setQuestionCount] = useState<QuestionCount>(20);

  // Quiz state
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);

  // Generate questions with a seed based on profile + timestamp for rotation
  const questions = useMemo(() => {
    if (!started) return [];
    const seed = profileId ? hashCode(profileId + Date.now().toString()) : Date.now();
    return getShuffledQuestions(difficulty, questionCount, seed);
  }, [started, difficulty, questionCount, profileId]);

  const q = questions[current];
  const progress = questions.length > 0 ? ((current + 1) / questions.length) * 100 : 0;

  const selectAnswer = (optIndex: number) => {
    if (!q) return;
    setAnswers({ ...answers, [q.id]: optIndex });
  };

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    const categories = [...new Set(questions.map((q) => q.category))];
    const scores = categories.map((cat) => {
      const catQs = questions.filter((q) => q.category === cat);
      const correct = catQs.filter((q) => answers[q.id] === q.correctAnswer).length;
      return { category: cat, score: correct, total_questions: catQs.length };
    });

    setQuizScores(scores);
    setShowResult(true);

    if (profileId) {
      for (const s of scores) {
        await supabase.from("quiz_scores").insert({
          profile_id: profileId,
          category: s.category,
          score: s.score,
          total_questions: s.total_questions,
        });
      }
    }
    toast.success("Quiz completed!");
  };

  const totalCorrect = questions.filter((q) => answers[q.id] === q.correctAnswer).length;

  // ========== SETUP SCREEN ==========
  if (!started) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
            <Settings2 className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Quiz Setup</h1>
            <p className="text-sm text-muted-foreground">Choose your quiz preferences before starting</p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 space-y-8 animate-fade-in">
          {/* Difficulty */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">Difficulty Level</label>
            <div className="grid grid-cols-3 gap-3">
              {([["medium", "Medium", "TCS NQT style questions"], ["hard", "Hard", "Advanced competitive level"], ["mixed", "Mixed", "Combination of both"]] as const).map(([val, label, desc]) => (
                <button key={val} type="button" onClick={() => setDifficulty(val)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    difficulty === val ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                  }`}>
                  <p className={`font-semibold text-sm ${difficulty === val ? "text-primary" : "text-foreground"}`}>{label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">Number of Questions</label>
            <div className="grid grid-cols-3 gap-3">
              {([20, 30, 50] as const).map((count) => (
                <button key={count} type="button" onClick={() => setQuestionCount(count)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    questionCount === count ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                  }`}>
                  <p className={`text-2xl font-display font-bold ${questionCount === count ? "text-primary" : "text-foreground"}`}>{count}</p>
                  <p className="text-xs text-muted-foreground">questions</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-secondary/50 rounded-lg p-4 text-sm text-muted-foreground">
            <p>📝 Questions are shuffled and rotated for each student. Categories include Aptitude, Programming, Data Structures, DBMS, and Operating Systems.</p>
          </div>

          <Button onClick={() => setStarted(true)} className="w-full gradient-primary text-primary-foreground text-lg py-6">
            Start Quiz <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // ========== RESULT SCREEN ==========
  if (showResult) {
    const categories = [...new Set(questions.map((q) => q.category))];
    return (
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="bg-card rounded-xl border border-border p-8 text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">Quiz Complete!</h1>
          <p className="text-lg text-muted-foreground">
            You scored <span className="text-foreground font-bold">{totalCorrect}/{questions.length}</span>
            <span className="ml-2 text-sm">({difficulty} level)</span>
          </p>

          <div className="space-y-3 text-left">
            {categories.map((cat) => {
              const catQs = questions.filter((q) => q.category === cat);
              const correct = catQs.filter((q) => answers[q.id] === q.correctAnswer).length;
              const pct = Math.round((correct / catQs.length) * 100);
              return (
                <div key={cat} className="flex items-center justify-between bg-secondary/50 rounded-lg p-3">
                  <span className="font-medium text-foreground">{cat}</span>
                  <span className={`font-bold ${pct >= 66 ? "text-success" : pct >= 33 ? "text-warning" : "text-destructive"}`}>{correct}/{catQs.length} ({pct}%)</span>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => { setCurrent(0); setAnswers({}); setShowResult(false); setStarted(false); }} className="flex-1">Retake Quiz</Button>
            <Button onClick={() => navigate("/dashboard")} className="flex-1 gradient-primary text-primary-foreground">View Dashboard <ChevronRight className="w-4 h-4 ml-1" /></Button>
          </div>
        </div>
      </div>
    );
  }

  // ========== QUIZ SCREEN ==========
  if (!q) return null;

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-accent-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Skill Assessment Quiz</h1>
          <p className="text-sm text-muted-foreground">{q.category} ({q.difficulty}) — Question {current + 1}/{questions.length}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="h-2 bg-secondary rounded-full mb-8 overflow-hidden">
        <div className="h-full gradient-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-6 animate-fade-in">
        <h2 className="text-lg font-semibold text-foreground">{q.question}</h2>
        <div className="space-y-3">
          {q.options.map((opt, i) => {
            const selected = answers[q.id] === i;
            return (
              <button
                key={i}
                onClick={() => selectAnswer(i)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/30 bg-card"
                }`}
              >
                <span className={`font-medium ${selected ? "text-primary" : "text-foreground"}`}>{opt}</span>
              </button>
            );
          })}
        </div>
        <Button onClick={next} disabled={answers[q.id] === undefined} className="w-full gradient-primary text-primary-foreground">
          {current < questions.length - 1 ? "Next Question" : "Finish Quiz"}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}
