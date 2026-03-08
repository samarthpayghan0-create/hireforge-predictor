import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { getShuffledQuestionsForSection, QuizQuestion } from "@/data/quizData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { BookOpen, ChevronRight, ChevronLeft, CheckCircle2, Settings2, Brain, Code, Database, Cpu } from "lucide-react";

type Difficulty = "medium" | "hard" | "mixed";
type QuestionCount = 20 | 30 | 50;

const SECTIONS = [
  { key: "Aptitude", label: "Aptitude", icon: Brain, categories: ["Aptitude"] },
  { key: "Programming", label: "Programming", icon: Code, categories: ["Programming"] },
  { key: "Data Structures", label: "Data Structures", icon: Database, categories: ["Data Structures"] },
  { key: "Core Subjects", label: "Core Subjects", icon: Cpu, categories: ["DBMS", "Operating Systems"] },
] as const;

type SectionKey = typeof SECTIONS[number]["key"];

export default function QuizPage() {
  const { profileId, setQuizScores } = useAppContext();
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [selectedSections, setSelectedSections] = useState<Set<SectionKey>>(new Set(["Aptitude"]));
  const [sectionCounts, setSectionCounts] = useState<Record<SectionKey, QuestionCount>>({
    "Aptitude": 20, "Programming": 20, "Data Structures": 20, "Core Subjects": 20,
  });

  const activeSections = SECTIONS.filter(s => selectedSections.has(s.key));
  const [activeSection, setActiveSection] = useState<SectionKey>("Aptitude");
  const [currentIndex, setCurrentIndex] = useState<Record<SectionKey, number>>({
    "Aptitude": 0, "Programming": 0, "Data Structures": 0, "Core Subjects": 0,
  });
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);

  const grouped = useMemo(() => {
    if (!started) return { "Aptitude": [], "Programming": [], "Data Structures": [], "Core Subjects": [] } as Record<SectionKey, QuizQuestion[]>;
    const baseSeed = profileId ? hashCode(profileId + Date.now().toString()) : Date.now();
    const result: Record<string, QuizQuestion[]> = {};
    SECTIONS.forEach((s, i) => {
      if (selectedSections.has(s.key)) {
        result[s.key] = getShuffledQuestionsForSection(
          [...s.categories], difficulty, sectionCounts[s.key], baseSeed + i * 1000
        );
      } else {
        result[s.key] = [];
      }
    });
    return result as Record<SectionKey, QuizQuestion[]>;
  }, [started, difficulty, sectionCounts, profileId, selectedSections]);

  const allQuestions = useMemo(() => activeSections.flatMap(s => grouped[s.key]), [grouped, activeSections]);

  const sectionQuestions = grouped[activeSection];
  const idx = currentIndex[activeSection];
  const q = sectionQuestions[idx];

  const sectionAnsweredCount = (key: SectionKey) => grouped[key].filter(q => answers[q.id] !== undefined).length;
  const answeredCount = allQuestions.filter(q => answers[q.id] !== undefined).length;

  const finishQuiz = async () => {
    const categories = [...new Set(allQuestions.map(q => q.category))];
    const scores = categories.map(cat => {
      const catQs = allQuestions.filter(q => q.category === cat);
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

  const totalCorrect = allQuestions.filter(q => answers[q.id] === q.correctAnswer).length;

  // Ensure activeSection is valid when starting
  const handleStart = () => {
    if (selectedSections.size === 0) {
      toast.error("Please select at least one section");
      return;
    }
    const firstSelected = SECTIONS.find(s => selectedSections.has(s.key));
    if (firstSelected) setActiveSection(firstSelected.key);
    setStarted(true);
  };

  if (!started) {
    return (
      <QuizSetup
        difficulty={difficulty} setDifficulty={setDifficulty}
        sectionCounts={sectionCounts} setSectionCounts={setSectionCounts}
        selectedSections={selectedSections} setSelectedSections={setSelectedSections}
        onStart={handleStart}
        onBack={() => navigate("/profile")}
      />
    );
  }

  if (showResult) {
    return (
      <QuizResult
        questions={allQuestions} answers={answers} totalCorrect={totalCorrect}
        difficulty={difficulty} grouped={grouped} activeSections={activeSections}
        onRetake={() => {
          setCurrentIndex({ "Aptitude": 0, "Programming": 0, "Data Structures": 0, "Core Subjects": 0 });
          setAnswers({});
          setShowResult(false);
          setStarted(false);
        }}
        onDashboard={() => navigate("/dashboard")}
      />
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
          <p className="text-sm text-muted-foreground">Answer questions across selected sections</p>
        </div>
      </div>

      {/* Overall progress */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
        <span>Overall: {Object.values(answers).length}/{allQuestions.length} answered</span>
        <span>{allQuestions.length > 0 ? Math.round((Object.values(answers).length / allQuestions.length) * 100) : 0}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full mb-6 overflow-hidden">
        <div className="h-full gradient-primary rounded-full transition-all duration-500" style={{ width: `${allQuestions.length > 0 ? (Object.values(answers).length / allQuestions.length) * 100 : 0}%` }} />
      </div>

      <Tabs value={activeSection} onValueChange={(v) => setActiveSection(v as SectionKey)}>
        <TabsList className={`w-full grid mb-6`} style={{ gridTemplateColumns: `repeat(${activeSections.length}, 1fr)` }}>
          {activeSections.map(s => (
            <TabsTrigger key={s.key} value={s.key} className="text-xs sm:text-sm gap-1">
              <s.icon className="w-3.5 h-3.5 hidden sm:block" />
              {s.label}
              <span className="ml-1 text-[10px] opacity-70">({sectionAnsweredCount(s.key)}/{grouped[s.key].length})</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {activeSections.map(section => {
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
                      <button key={i} onClick={() => setAnswers({ ...answers, [secQ.id]: i })}
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
                    <Button onClick={() => setCurrentIndex({ ...currentIndex, [section.key]: secIdx + 1 })} className="flex-1 gradient-primary text-primary-foreground">
                      {answers[secQ.id] === undefined ? "Skip" : "Next"} <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  ) : (
                    <Button onClick={() => {
                      const nextSection = activeSections.find(s => s.key !== section.key && sectionAnsweredCount(s.key) < grouped[s.key].length);
                      if (nextSection) {
                        setActiveSection(nextSection.key);
                        toast.info(`Moving to ${nextSection.label}`);
                      }
                    }} variant="outline" className="flex-1">
                      Section Done ✓
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      <div className="mt-6 space-y-3">
        <Button variant="outline" onClick={() => { setStarted(false); setAnswers({}); setCurrentIndex({ "Aptitude": 0, "Programming": 0, "Data Structures": 0, "Core Subjects": 0 }); }} className="w-full">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Setup
        </Button>
        <Button onClick={finishQuiz} disabled={answeredCount === 0} className="w-full gradient-primary text-primary-foreground text-lg py-6">
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Finish Quiz ({answeredCount}/{allQuestions.length} answered)
        </Button>
        {answeredCount < allQuestions.length && <p className="text-xs text-muted-foreground text-center mt-2">You can skip questions — unanswered ones will be marked incorrect</p>}
      </div>
    </div>
  );
}

// ========== SETUP COMPONENT ==========
function QuizSetup({ difficulty, setDifficulty, sectionCounts, setSectionCounts, selectedSections, setSelectedSections, onStart, onBack }: {
  difficulty: Difficulty; setDifficulty: (d: Difficulty) => void;
  sectionCounts: Record<SectionKey, QuestionCount>;
  setSectionCounts: (c: Record<SectionKey, QuestionCount>) => void;
  selectedSections: Set<SectionKey>;
  setSelectedSections: (s: Set<SectionKey>) => void;
  onStart: () => void;
  onBack: () => void;
}) {
  const updateCount = (key: SectionKey, count: QuestionCount) => {
    setSectionCounts({ ...sectionCounts, [key]: count });
  };

  const toggleSection = (key: SectionKey) => {
    const next = new Set(selectedSections);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelectedSections(next);
  };

  const totalQuestions = SECTIONS
    .filter(s => selectedSections.has(s.key))
    .reduce((a, s) => a + sectionCounts[s.key], 0);

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
          <Settings2 className="w-5 h-5 text-accent-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Quiz Setup</h1>
          <p className="text-sm text-muted-foreground">Choose sections and preferences before starting</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-8 animate-fade-in">
        {/* Section Selection */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground">Select Sections <span className="text-muted-foreground font-normal">(choose one or more)</span></label>
          <div className="grid grid-cols-2 gap-3">
            {SECTIONS.map(section => {
              const isSelected = selectedSections.has(section.key);
              return (
                <button key={section.key} type="button" onClick={() => toggleSection(section.key)}
                  className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? "gradient-primary" : "bg-secondary"}`}>
                    <section.icon className={`w-4 h-4 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${isSelected ? "text-primary" : "text-foreground"}`}>{section.label}</p>
                    <p className="text-xs text-muted-foreground">{isSelected ? "Selected" : "Tap to add"}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty */}
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

        {/* Per-section question counts - only for selected sections */}
        {selectedSections.size > 0 && (
          <div className="space-y-4">
            <label className="text-sm font-semibold text-foreground">Questions Per Section</label>
            {SECTIONS.filter(s => selectedSections.has(s.key)).map(section => (
              <div key={section.key} className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <section.icon className="w-4 h-4" />
                  <span className="font-medium text-foreground">{section.label}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {([20, 30, 50] as const).map(count => (
                    <button key={count} type="button" onClick={() => updateCount(section.key, count)}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${sectionCounts[section.key] === count ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                      <p className={`text-lg font-bold ${sectionCounts[section.key] === count ? "text-primary" : "text-foreground"}`}>{count}</p>
                      <p className="text-[10px] text-muted-foreground">questions</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-secondary/50 rounded-lg p-4 text-sm text-muted-foreground">
          <p>📝 Select the sections you want to attempt. Medium-level aptitude questions are based on <strong>TCS NQT</strong> pattern. Total questions: <strong>{totalQuestions}</strong></p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <Button onClick={onStart} disabled={selectedSections.size === 0} className="flex-1 gradient-primary text-primary-foreground text-lg py-6">
            Start Quiz ({selectedSections.size} section{selectedSections.size !== 1 ? "s" : ""}) <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ========== RESULT COMPONENT ==========
function QuizResult({ questions, answers, totalCorrect, difficulty, grouped, activeSections, onRetake, onDashboard }: {
  questions: QuizQuestion[]; answers: Record<number, number>; totalCorrect: number; difficulty: string;
  grouped: Record<SectionKey, QuizQuestion[]>; activeSections: typeof SECTIONS[number][]; onRetake: () => void; onDashboard: () => void;
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
          {activeSections.map(section => {
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
