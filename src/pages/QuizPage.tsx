import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { getShuffledQuestionsForSection, QuizQuestion, ProgrammingLanguage } from "@/data/quizData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { BookOpen, ChevronRight, ChevronLeft, CheckCircle2, Settings2, Brain, Code, Database, Cpu, Trophy, Target, Zap, Languages } from "lucide-react";

type Difficulty = "medium" | "hard" | "mixed";
type QuestionCount = 20 | 30 | 50;

const SECTIONS = [
  { key: "Aptitude", label: "Aptitude", icon: Brain, categories: ["Aptitude"] },
  { key: "Programming", label: "Programming", icon: Code, categories: ["Programming"] },
  { key: "Data Structures", label: "Data Structures", icon: Database, categories: ["Data Structures"] },
  { key: "Core Subjects", label: "Core Subjects", icon: Cpu, categories: ["DBMS", "Operating Systems"] },
] as const;

type SectionKey = typeof SECTIONS[number]["key"];

function hashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export default function QuizPage() {
  const { profileId, setQuizScores } = useAppContext();
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [selectedSections, setSelectedSections] = useState<Set<SectionKey>>(new Set(["Aptitude"]));
  const [sectionCounts, setSectionCounts] = useState<Record<SectionKey, QuestionCount>>({
    "Aptitude": 20, "Programming": 20, "Data Structures": 20, "Core Subjects": 20,
  });
  const [programmingLanguage, setProgrammingLanguage] = useState<ProgrammingLanguage>("General");

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
        const lang = s.key === "Programming" ? programmingLanguage : undefined;
        result[s.key] = getShuffledQuestionsForSection(
          [...s.categories], difficulty, sectionCounts[s.key], baseSeed + i * 1000, lang
        );
      } else {
        result[s.key] = [];
      }
    });
    return result as Record<SectionKey, QuizQuestion[]>;
  }, [started, difficulty, sectionCounts, profileId, selectedSections, programmingLanguage]);

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
        programmingLanguage={programmingLanguage} setProgrammingLanguage={setProgrammingLanguage}
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
    <div className="min-h-screen bg-pattern">
      <div className="container mx-auto px-4 lg:px-8 py-10 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-accent shadow-glow-accent flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Skill Assessment</h1>
            <p className="text-muted-foreground">Answer questions across selected sections</p>
          </div>
        </div>

        {/* Overall progress card */}
        <div className="card-elevated p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">Overall Progress</span>
            <span className="text-sm font-bold text-primary">{answeredCount}/{allQuestions.length} answered</span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full gradient-primary rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${allQuestions.length > 0 ? (answeredCount / allQuestions.length) * 100 : 0}%` }} 
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeSection} onValueChange={(v) => setActiveSection(v as SectionKey)}>
          <TabsList className={`w-full grid mb-6 bg-secondary/50 p-1 rounded-xl`} style={{ gridTemplateColumns: `repeat(${activeSections.length}, 1fr)` }}>
            {activeSections.map(s => (
              <TabsTrigger 
                key={s.key} 
                value={s.key} 
                className="text-xs sm:text-sm gap-1.5 py-3 rounded-lg data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow"
              >
                <s.icon className="w-4 h-4 hidden sm:block" />
                {s.label}
                <span className="ml-1 text-[10px] opacity-80 font-medium">
                  ({sectionAnsweredCount(s.key)}/{grouped[s.key].length})
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {activeSections.map(section => {
            const secQs = grouped[section.key];
            const secIdx = currentIndex[section.key];
            const secQ = secQs[secIdx];
            
            if (!secQ) return (
              <TabsContent key={section.key} value={section.key}>
                <div className="card-elevated p-8 text-center text-muted-foreground">
                  No questions in this section for current difficulty settings.
                </div>
              </TabsContent>
            );
            
            const secProgress = ((secIdx + 1) / secQs.length) * 100;
            
            return (
              <TabsContent key={section.key} value={section.key}>
                {/* Section progress */}
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-muted-foreground font-medium">
                    {section.key === "Core Subjects" ? secQ.category : section.label} — Q{secIdx + 1} of {secQs.length}
                  </span>
                  <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
                    secQ.difficulty === 'hard' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'
                  }`}>
                    {secQ.difficulty}
                  </span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full mb-6 overflow-hidden">
                  <div className="h-full gradient-accent rounded-full transition-all duration-500" style={{ width: `${secProgress}%` }} />
                </div>

                {/* Question card */}
                <div className="card-elevated p-6 md:p-8 space-y-6 animate-fade-in">
                  <h2 className="text-lg md:text-xl font-semibold text-foreground leading-relaxed">{secQ.question}</h2>
                  
                  <div className="space-y-3">
                    {secQ.options.map((opt, i) => {
                      const selected = answers[secQ.id] === i;
                      return (
                        <button 
                          key={i} 
                          onClick={() => setAnswers({ ...answers, [secQ.id]: i })}
                          className={`w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all duration-200 ${
                            selected 
                              ? "border-primary bg-primary/5 shadow-glow" 
                              : "border-border hover:border-primary/40 bg-card hover:bg-secondary/30"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                              selected ? "gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                            }`}>
                              {String.fromCharCode(65 + i)}
                            </div>
                            <span className={`font-medium ${selected ? "text-primary" : "text-foreground"}`}>{opt}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Navigation */}
                  <div className="flex gap-3 pt-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentIndex({ ...currentIndex, [section.key]: secIdx - 1 })} 
                      disabled={secIdx === 0} 
                      className="flex-1 h-12 rounded-xl"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                    </Button>
                    {secIdx < secQs.length - 1 ? (
                      <Button 
                        onClick={() => setCurrentIndex({ ...currentIndex, [section.key]: secIdx + 1 })} 
                        className="flex-1 gradient-primary text-primary-foreground h-12 rounded-xl shadow-glow"
                      >
                        {answers[secQ.id] === undefined ? "Skip" : "Next"} <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => {
                          const nextSection = activeSections.find(s => s.key !== section.key && sectionAnsweredCount(s.key) < grouped[s.key].length);
                          if (nextSection) {
                            setActiveSection(nextSection.key);
                            toast.info(`Moving to ${nextSection.label}`);
                          }
                        }} 
                        variant="outline" 
                        className="flex-1 h-12 rounded-xl border-accent text-accent"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Section Done
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Bottom actions */}
        <div className="mt-8 space-y-3">
          <Button 
            variant="outline" 
            onClick={() => { setStarted(false); setAnswers({}); setCurrentIndex({ "Aptitude": 0, "Programming": 0, "Data Structures": 0, "Core Subjects": 0 }); }} 
            className="w-full h-12 rounded-xl"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Setup
          </Button>
          <Button 
            onClick={finishQuiz} 
            disabled={answeredCount === 0} 
            className="w-full gradient-primary text-primary-foreground h-14 text-lg rounded-xl shadow-glow"
          >
            <Trophy className="w-5 h-5 mr-2" />
            Finish Quiz ({answeredCount}/{allQuestions.length})
          </Button>
          {answeredCount < allQuestions.length && (
            <p className="text-xs text-muted-foreground text-center">
              You can skip questions — unanswered ones will be marked incorrect
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ========== SETUP COMPONENT ==========
function QuizSetup({ difficulty, setDifficulty, sectionCounts, setSectionCounts, selectedSections, setSelectedSections, programmingLanguage, setProgrammingLanguage, onStart, onBack }: {
  difficulty: Difficulty; setDifficulty: (d: Difficulty) => void;
  sectionCounts: Record<SectionKey, QuestionCount>;
  setSectionCounts: (c: Record<SectionKey, QuestionCount>) => void;
  selectedSections: Set<SectionKey>;
  setSelectedSections: (s: Set<SectionKey>) => void;
  programmingLanguage: ProgrammingLanguage;
  setProgrammingLanguage: (l: ProgrammingLanguage) => void;
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
    <div className="min-h-screen bg-pattern">
      <div className="container mx-auto px-4 lg:px-8 py-10 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-accent shadow-glow-accent flex items-center justify-center">
            <Settings2 className="w-7 h-7 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Quiz Setup</h1>
            <p className="text-muted-foreground">Configure your assessment preferences</p>
          </div>
        </div>

        <div className="card-elevated p-6 md:p-8 space-y-8 animate-fade-in">
          {/* Section Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <label className="text-base font-semibold text-foreground">Select Sections</label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {SECTIONS.map(section => {
                const isSelected = selectedSections.has(section.key);
                return (
                  <button 
                    key={section.key} 
                    type="button" 
                    onClick={() => toggleSection(section.key)}
                    className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                      isSelected 
                        ? "border-primary bg-primary/5 shadow-glow" 
                        : "border-border hover:border-primary/40 bg-card"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isSelected ? "gradient-primary shadow-md" : "bg-secondary"
                      }`}>
                        <section.icon className={`w-6 h-6 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <p className={`font-semibold ${isSelected ? "text-primary" : "text-foreground"}`}>{section.label}</p>
                        <p className="text-xs text-muted-foreground">{isSelected ? "✓ Selected" : "Tap to add"}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-warning" />
              <label className="text-base font-semibold text-foreground">Difficulty Level</label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {([
                ["medium", "Medium", "Standard level"],
                ["hard", "Hard", "Advanced level"],
                ["mixed", "Mixed", "Both combined"]
              ] as const).map(([val, label, desc]) => (
                <button 
                  key={val} 
                  type="button" 
                  onClick={() => setDifficulty(val)}
                  className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                    difficulty === val 
                      ? "border-primary bg-primary/5 shadow-glow" 
                      : "border-border hover:border-primary/40 bg-card"
                  }`}
                >
                  <p className={`font-semibold ${difficulty === val ? "text-primary" : "text-foreground"}`}>{label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Per-section question counts */}
          {selectedSections.size > 0 && (
            <div className="space-y-5">
              <label className="text-base font-semibold text-foreground">Questions Per Section</label>
              {SECTIONS.filter(s => selectedSections.has(s.key)).map(section => (
                <div key={section.key} className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <section.icon className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">{section.label}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {([20, 30, 50] as const).map(count => (
                      <button 
                        key={count} 
                        type="button" 
                        onClick={() => updateCount(section.key, count)}
                        className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                          sectionCounts[section.key] === count 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/40 bg-card"
                        }`}
                      >
                        <p className={`text-2xl font-bold ${sectionCounts[section.key] === count ? "text-primary" : "text-foreground"}`}>
                          {count}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">questions</p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info box */}
          <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-foreground font-medium">About this quiz</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Medium-level aptitude questions follow <strong>TCS NQT</strong> patterns. 
                  Total questions: <strong className="text-primary">{totalQuestions}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onBack} className="flex-1 h-12 rounded-xl">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button 
              onClick={onStart} 
              disabled={selectedSections.size === 0} 
              className="flex-1 gradient-primary text-primary-foreground h-14 text-lg rounded-xl shadow-glow"
            >
              Start Quiz ({selectedSections.size}) <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
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
  const percentage = Math.round((totalCorrect / questions.length) * 100);
  const isGood = percentage >= 60;

  return (
    <div className="min-h-screen bg-pattern">
      <div className="container mx-auto px-4 lg:px-8 py-10 max-w-2xl">
        <div className="card-elevated p-8 md:p-10 text-center space-y-8 animate-fade-in">
          {/* Trophy */}
          <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center ${isGood ? "gradient-accent shadow-glow-accent" : "gradient-warm"}`}>
            <Trophy className="w-12 h-12 text-white" />
          </div>

          {/* Score */}
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">Quiz Complete!</h1>
            <p className="text-muted-foreground">Here's how you performed</p>
          </div>

          <div className={`text-6xl md:text-7xl font-display font-bold ${isGood ? "text-gradient-accent" : "text-gradient"}`}>
            {percentage}%
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-success/10 rounded-2xl p-5 border border-success/20">
              <p className="text-3xl font-bold text-success">{totalCorrect}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
            <div className="bg-destructive/10 rounded-2xl p-5 border border-destructive/20">
              <p className="text-3xl font-bold text-destructive">{questions.length - totalCorrect}</p>
              <p className="text-sm text-muted-foreground">Incorrect</p>
            </div>
          </div>

          {/* Section breakdown */}
          <div className="space-y-3 text-left">
            <p className="text-sm font-semibold text-foreground">Section Breakdown</p>
            {activeSections.map(s => {
              const secQs = grouped[s.key];
              const secCorrect = secQs.filter(q => answers[q.id] === q.correctAnswer).length;
              const secPct = Math.round((secCorrect / secQs.length) * 100);
              return (
                <div key={s.key} className="flex items-center justify-between bg-secondary/50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <s.icon className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium text-foreground">{s.label}</span>
                  </div>
                  <span className={`font-bold ${secPct >= 60 ? "text-success" : secPct >= 40 ? "text-warning" : "text-destructive"}`}>
                    {secCorrect}/{secQs.length} ({secPct}%)
                  </span>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onRetake} className="flex-1 h-12 rounded-xl">
              Retake Quiz
            </Button>
            <Button onClick={onDashboard} className="flex-1 gradient-primary text-primary-foreground h-12 rounded-xl shadow-glow">
              View Dashboard <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
