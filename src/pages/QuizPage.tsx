import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { getShuffledQuestions, QuizQuestion } from "@/data/quizData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { BookOpen, ChevronRight, CheckCircle2, Settings2, Brain, Code, Database, Cpu } from "lucide-react";

type Difficulty = "medium" | "hard" | "mixed";
type QuestionCount = 20 | 30 | 50;

const SECTIONS = [
  { key: "Aptitude", label: "Aptitude", icon: Brain },
  { key: "Programming", label: "Programming", icon: Code },
  { key: "Data Structures", label: "Data Structures", icon: Database },
  { key: "Core Subjects", label: "Core Subjects", icon: Cpu },
] as const;

type SectionKey = typeof SECTIONS[number]["key"];

// Core Subjects = DBMS + Operating Systems
const CORE_CATEGORIES = ["DBMS", "Operating Systems"];

function groupBySection(questions: QuizQuestion[]): Record<SectionKey, QuizQuestion[]> {
  return {
    "Aptitude": questions.filter(q => q.category === "Aptitude"),
    "Programming": questions.filter(q => q.category === "Programming"),
    "Data Structures": questions.filter(q => q.category === "Data Structures"),
    "Core Subjects": questions.filter(q => CORE_CATEGORIES.includes(q.category)),
  };
}

export default function QuizPage() {
  const { profileId, setQuizScores } = useAppContext();
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [questionCount, setQuestionCount] = useState<QuestionCount>(20);

  const [activeSection, setActiveSection] = useState<SectionKey>("Aptitude");
  const [currentIndex, setCurrentIndex] = useState<Record<SectionKey, number>>({
    "Aptitude": 0, "Programming": 0, "Data Structures": 0, "Core Subjects": 0,
  });
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);

  const questions = useMemo(() => {
    if (!started) return [];
    const seed = profileId ? hashCode(profileId + Date.now().toString()) : Date.now();
    return getShuffledQuestions(difficulty, questionCount, seed);
  }, [started, difficulty, questionCount, profileId]);

  const grouped = useMemo(() => groupBySection(questions), [questions]);

  const sectionQuestions = grouped[activeSection];
  const idx = currentIndex[activeSection];
  const q = sectionQuestions[idx];

  const selectAnswer = (optIndex: number) => {
    if (!q) return;
    setAnswers({ ...answers, [q.id]: optIndex });
  };

  const next = () => {
    if (idx < sectionQuestions.length - 1) {
      setCurrentIndex({ ...currentIndex, [activeSection]: idx + 1 });
    }
  };

  const prev = () => {
    if (idx > 0) {
      setCurrentIndex({ ...currentIndex, [activeSection]: idx - 1 });
    }
  };

  const allAnswered = questions.every(q => answers[q.id] !== undefined);
  const sectionAnsweredCount = (key: SectionKey) => grouped[key].filter(q => answers[q.id] !== undefined).length;

  const finishQuiz = async () => {
    const categories = [...new Set(questions.map(q => q.category))];
    const scores = categories.map(cat => {
      const catQs = questions.filter(q => q.category === cat);
      const correct = catQs.filter(q => answers[q.id] === q.correctAnswer).length;
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

  const totalCorrect = questions.filter(q => answers[q.id] === q.correctAnswer).length;

  // ========== SETUP SCREEN ==========
  if (!started) {
    return <QuizSetup difficulty={difficulty} setDifficulty={setDifficulty} questionCount={questionCount} setQuestionCount={setQuestionCount} onStart={() => setStarted(true)} />;
  }

  // ========== RESULT SCREEN ==========
  if (showResult) {
    return <QuizResult questions={questions} answers={answers} totalCorrect={totalCorrect} difficulty={difficulty} grouped={grouped}
      onRetake={() => { setCurrentIndex({ "Aptitude": 0, "Programming": 0, "Data Structures": 0, "Core Subjects": 0 }); setAnswers({}); setShowResult(false); setStarted(false); }}
      onDashboard={() => navigate("/dashboard")} />;
  }

  // ========== QUIZ SCREEN WITH TABS ==========
  if (!q && sectionQuestions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-3xl text-center">
        <p className="text-muted-foreground">No questions available for this section at current settings.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-accent-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Skill Assessment Quiz</h1>
          <p className="text-sm text-muted-foreground">Answer questions across all sections</p>
        </div>
      </div>

      {/* Overall progress */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
        <span>Overall: {Object.values(answers).length}/{questions.length} answered</span>
        <span>{Math.round((Object.values(answers).length / questions.length) * 100)}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full mb-6 overflow-hidden">
        <div className="h-full gradient-primary rounded-full transition-all duration-500" style={{ width: `${(Object.values(answers).length / questions.length) * 100}%` }} />
      </div>

      <Tabs value={activeSection} onValueChange={(v) => setActiveSection(v as SectionKey)}>
        <TabsList className="w-full grid grid-cols-4 mb-6">
          {SECTIONS.map(s => (
            <TabsTrigger key={s.key} value={s.key} className="text-xs sm:text-sm gap-1">
              <s.icon className="w-3.5 h-3.5 hidden sm:block" />
              {s.label}
              <span className="ml-1 text-[10px] opacity-70">({sectionAnsweredCount(s.key)}/{grouped[s.key].length})</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {SECTIONS.map(section => {
          const secQs = grouped[section.key];
          const secIdx = currentIndex[section.key];
          const secQ = secQs[secIdx];
          if (!secQ) return (
            <TabsContent key={section.key} value={section.key}>
              <div className="bg-card rounded-xl border border-border p-6 text-center text-muted-foreground">
                No questions in this section for current difficulty settings.
              </div>
            </TabsContent>
          );
          const secProgress = ((secIdx + 1) / secQs.length) * 100;
          return (
            <TabsContent key={section.key} value={section.key}>
              <div className="text-xs text-muted-foreground mb-2 flex justify-between">
                <span>{section.key === "Core Subjects" ? secQ.category : section.label} — Question {secIdx + 1}/{secQs.length}</span>
                <span className="capitalize">{secQ.difficulty}</span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full mb-4 overflow-hidden">
                <div className="h-full gradient-accent rounded-full transition-all duration-500" style={{ width: `${secProgress}%` }} />
              </div>

              <div className="bg-card rounded-xl border border-border p-6 space-y-5 animate-fade-in">
                <h2 className="text-lg font-semibold text-foreground">{secQ.question}</h2>
                <div className="space-y-3">
                  {secQ.options.map((opt, i) => {
                    const selected = answers[secQ.id] === i;
                    return (
                      <button key={i} onClick={() => { setAnswers({ ...answers, [secQ.id]: i }); }}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/30 bg-card"}`}>
                        <span className={`font-medium ${selected ? "text-primary" : "text-foreground"}`}>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setCurrentIndex({ ...currentIndex, [section.key]: secIdx - 1 })} disabled={secIdx === 0} className="flex-1">
                    Previous
                  </Button>
                  {secIdx < secQs.length - 1 ? (
                    <Button onClick={() => setCurrentIndex({ ...currentIndex, [section.key]: secIdx + 1 })} disabled={answers[secQ.id] === undefined} className="flex-1 gradient-primary text-primary-foreground">
                      Next <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  ) : (
                    <Button onClick={() => {
                      // Move to next incomplete section or finish
                      const nextSection = SECTIONS.find(s => s.key !== section.key && sectionAnsweredCount(s.key) < grouped[s.key].length);
                      if (nextSection) {
                        setActiveSection(nextSection.key);
                        toast.info(`Moving to ${nextSection.label}`);
                      }
                    }} disabled={answers[secQ.id] === undefined} variant="outline" className="flex-1">
                      Section Done ✓
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Finish button */}
      <div className="mt-6">
        <Button onClick={finishQuiz} disabled={!allAnswered} className="w-full gradient-primary text-primary-foreground text-lg py-6">
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Finish Quiz ({Object.values(answers).length}/{questions.length} answered)
        </Button>
        {!allAnswered && <p className="text-xs text-muted-foreground text-center mt-2">Answer all questions across all sections to submit</p>}
      </div>
    </div>
  );
}

// ========== SETUP COMPONENT ==========
function QuizSetup({ difficulty, setDifficulty, questionCount, setQuestionCount, onStart }: {
  difficulty: Difficulty; setDifficulty: (d: Difficulty) => void;
  questionCount: QuestionCount; setQuestionCount: (c: QuestionCount) => void;
  onStart: () => void;
}) {
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
        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground">Difficulty Level</label>
          <div className="grid grid-cols-3 gap-3">
            {([["medium", "Medium", "Standard level questions"], ["hard", "Hard", "Advanced competitive level"], ["mixed", "Mixed", "Combination of both"]] as const).map(([val, label, desc]) => (
              <button key={val} type="button" onClick={() => setDifficulty(val)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${difficulty === val ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                <p className={`font-semibold text-sm ${difficulty === val ? "text-primary" : "text-foreground"}`}>{label}</p>
                <p className="text-xs text-muted-foreground mt-1">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground">Number of Questions</label>
          <div className="grid grid-cols-3 gap-3">
            {([20, 30, 50] as const).map((count) => (
              <button key={count} type="button" onClick={() => setQuestionCount(count)}
                className={`p-4 rounded-xl border-2 text-center transition-all ${questionCount === count ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                <p className={`text-2xl font-display font-bold ${questionCount === count ? "text-primary" : "text-foreground"}`}>{count}</p>
                <p className="text-xs text-muted-foreground">questions</p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-secondary/50 rounded-lg p-4 text-sm text-muted-foreground">
          <p>📝 Questions are divided into <strong>4 sections</strong>: Aptitude, Programming, Data Structures, and Core Subjects (DBMS & OS). Medium-level aptitude questions are based on <strong>TCS NQT</strong> pattern. Navigate between sections using tabs.</p>
        </div>

        <Button onClick={onStart} className="w-full gradient-primary text-primary-foreground text-lg py-6">
          Start Quiz <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// ========== RESULT COMPONENT ==========
function QuizResult({ questions, answers, totalCorrect, difficulty, grouped, onRetake, onDashboard }: {
  questions: QuizQuestion[]; answers: Record<number, number>; totalCorrect: number; difficulty: string;
  grouped: Record<SectionKey, QuizQuestion[]>; onRetake: () => void; onDashboard: () => void;
}) {
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
          {SECTIONS.map(section => {
            const secQs = grouped[section.key];
            if (secQs.length === 0) return null;
            const correct = secQs.filter(q => answers[q.id] === q.correctAnswer).length;
            const pct = Math.round((correct / secQs.length) * 100);
            return (
              <div key={section.key} className="flex items-center justify-between bg-secondary/50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <section.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{section.label}</span>
                </div>
                <span className={`font-bold ${pct >= 66 ? "text-success" : pct >= 33 ? "text-warning" : "text-destructive"}`}>{correct}/{secQs.length} ({pct}%)</span>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onRetake} className="flex-1">Retake Quiz</Button>
          <Button onClick={onDashboard} className="flex-1 gradient-primary text-primary-foreground">View Dashboard <ChevronRight className="w-4 h-4 ml-1" /></Button>
        </div>
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
