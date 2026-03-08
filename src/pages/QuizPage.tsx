import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { quizQuestions } from "@/data/quizData";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BookOpen, ChevronRight, CheckCircle2, XCircle } from "lucide-react";

export default function QuizPage() {
  const { profileId, setQuizScores } = useAppContext();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);

  const q = quizQuestions[current];
  const progress = ((current + 1) / quizQuestions.length) * 100;

  const selectAnswer = (optIndex: number) => {
    setAnswers({ ...answers, [q.id]: optIndex });
  };

  const next = () => {
    if (current < quizQuestions.length - 1) {
      setCurrent(current + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    // Calculate scores per category
    const categories = [...new Set(quizQuestions.map((q) => q.category))];
    const scores = categories.map((cat) => {
      const catQs = quizQuestions.filter((q) => q.category === cat);
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

  const totalCorrect = quizQuestions.filter((q) => answers[q.id] === q.correctAnswer).length;

  if (showResult) {
    const categories = [...new Set(quizQuestions.map((q) => q.category))];
    return (
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="bg-card rounded-xl border border-border p-8 text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">Quiz Complete!</h1>
          <p className="text-lg text-muted-foreground">You scored <span className="text-foreground font-bold">{totalCorrect}/{quizQuestions.length}</span></p>

          <div className="space-y-3 text-left">
            {categories.map((cat) => {
              const catQs = quizQuestions.filter((q) => q.category === cat);
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
            <Button variant="outline" onClick={() => { setCurrent(0); setAnswers({}); setShowResult(false); }} className="flex-1">Retake Quiz</Button>
            <Button onClick={() => navigate("/voice")} className="flex-1 gradient-primary text-primary-foreground">Continue to Voice <ChevronRight className="w-4 h-4 ml-1" /></Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-accent-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Skill Assessment Quiz</h1>
          <p className="text-sm text-muted-foreground">{q.category} — Question {current + 1}/{quizQuestions.length}</p>
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
          {current < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
