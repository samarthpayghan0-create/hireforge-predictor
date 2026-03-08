import { useState, useRef, useCallback } from "react";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Mic, MicOff, ChevronRight, ArrowRight, Briefcase, MessageSquare,
  CheckCircle2, Loader2, RefreshCw, Target, Zap, AlertTriangle
} from "lucide-react";

interface PerQuestion { relevance: number; clarity: number; completeness: number; feedback: string }
interface EvalResult {
  per_question: PerQuestion[];
  overall_score: number;
  overall_feedback: string[];
  strengths: string[];
  improvements: string[];
}

const CATEGORIES = [
  { id: "mixed", label: "Mixed", desc: "HR + Technical + Behavioral" },
  { id: "HR", label: "HR", desc: "Personal & situational" },
  { id: "Technical", label: "Technical", desc: "Tech concepts & problem solving" },
  { id: "Behavioral", label: "Behavioral", desc: "Past experiences & scenarios" },
];

export default function MockInterviewPage() {
  const { profileId, setCommResult } = useAppContext();
  const { user } = useAuth();

  const [phase, setPhase] = useState<"setup" | "loading" | "interview" | "evaluating" | "results">("setup");
  const [category, setCategory] = useState("mixed");
  const [questions, setQuestions] = useState<{ question: string; category: string; tip: string }[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState<EvalResult | null>(null);

  const recognitionRef = useRef<any>(null);

  const generateQuestions = async () => {
    setPhase("loading");
    try {
      const { data, error } = await supabase.functions.invoke("mock-interview", {
        body: { action: "generate", category },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (!data?.questions?.length) throw new Error("No questions generated");
      setQuestions(data.questions.slice(0, 5));
      setAnswers([]);
      setCurrentQ(0);
      setCurrentAnswer("");
      setPhase("interview");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate questions");
      setPhase("setup");
    }
  };

  const startRecording = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { toast.error("Speech recognition not supported. Use Chrome."); return; }
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    let finalT = "";
    recognition.onresult = (e: any) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalT += e.results[i][0].transcript + " ";
        else interim += e.results[i][0].transcript;
      }
      setCurrentAnswer(finalT + interim);
    };
    recognition.onerror = (e: any) => { toast.error("Error: " + e.error); setIsRecording(false); };
    recognition.onend = () => setIsRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  }, []);

  const submitAnswer = () => {
    if (!currentAnswer.trim()) { toast.error("Please provide an answer"); return; }
    const newAnswers = [...answers, currentAnswer.trim()];
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setCurrentAnswer("");
    } else {
      evaluateInterview(newAnswers);
    }
  };

  const evaluateInterview = async (allAnswers: string[]) => {
    setPhase("evaluating");
    try {
      const { data, error } = await supabase.functions.invoke("mock-interview", {
        body: {
          action: "evaluate",
          category,
          questions,
          answers: allAnswers,
          profileId: profileId || null,
          userId: user?.id || null,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data);

      // Update comm result in context
      const overallPct = Math.round((data.overall_score || 0) * 10);
      setCommResult({
        speaking_speed: 0,
        fluency_score: overallPct,
        clarity_score: overallPct,
        confidence_score: overallPct,
        overall_score: overallPct,
        transcript: allAnswers.join("\n\n"),
      });

      setPhase("results");
      toast.success("Interview evaluated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to evaluate");
      setPhase("interview");
    }
  };

  const getScoreColor = (s: number) => s >= 7 ? "text-success" : s >= 5 ? "text-warning" : "text-destructive";

  // SETUP
  if (phase === "setup") {
    return (
      <div className="min-h-screen bg-pattern">
        <div className="container mx-auto px-4 lg:px-8 py-10 max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl gradient-warm flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">AI Mock Interview</h1>
              <p className="text-muted-foreground">Practice with AI-generated questions & feedback</p>
            </div>
          </div>

          <div className="card-elevated p-6 md:p-8 space-y-6 animate-fade-in">
            <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground">How it works</h3>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• AI generates 5 interview questions for your chosen category</li>
                    <li>• Answer via text or voice recording</li>
                    <li>• AI evaluates relevance, clarity, and completeness</li>
                    <li>• Get a score out of 10 with detailed feedback</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Select Category</p>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      category === c.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                    }`}
                  >
                    <p className="font-semibold text-foreground text-sm">{c.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{c.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={generateQuestions} className="w-full gradient-primary text-primary-foreground h-14 text-lg rounded-xl shadow-glow">
              Generate Questions <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // LOADING
  if (phase === "loading" || phase === "evaluating") {
    return (
      <div className="min-h-screen bg-pattern flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-lg font-semibold text-foreground">
            {phase === "loading" ? "Generating interview questions..." : "AI is evaluating your answers..."}
          </p>
          <p className="text-sm text-muted-foreground">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  // INTERVIEW
  if (phase === "interview") {
    const q = questions[currentQ];
    return (
      <div className="min-h-screen bg-pattern">
        <div className="container mx-auto px-4 lg:px-8 py-10 max-w-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl gradient-warm flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-display font-bold text-foreground">Mock Interview</h1>
              <p className="text-muted-foreground text-sm">Question {currentQ + 1} of {questions.length}</p>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            {questions.map((_, i) => (
              <div key={i} className={`flex-1 h-2 rounded-full ${i < currentQ ? "gradient-accent" : i === currentQ ? "gradient-primary" : "bg-secondary"}`} />
            ))}
          </div>

          <div className="card-elevated p-6 md:p-8 space-y-6 animate-fade-in">
            <div>
              <span className="text-xs font-bold uppercase text-primary px-3 py-1 bg-primary/10 rounded-full">{q?.category || category}</span>
              <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mt-3">"{q?.question}"</h2>
              {q?.tip && <p className="text-sm text-muted-foreground mt-2">💡 {q.tip}</p>}
            </div>

            {/* Answer input with mic */}
            <div className="space-y-3">
              <div className="relative">
                <Textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder={isRecording ? "🎙️ Listening... speak your answer" : "Type your answer or click the mic to speak..."}
                  className={`min-h-[150px] rounded-xl text-base pr-16 transition-all ${isRecording ? "border-destructive/50 bg-destructive/5" : ""}`}
                />
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all ${isRecording ? "bg-destructive animate-pulse scale-110" : "gradient-primary shadow-glow hover:scale-105"}`}
                  title={isRecording ? "Stop recording" : "Start recording"}
                >
                  {isRecording ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
                </button>
              </div>
              {isRecording && (
                <p className="text-xs text-destructive font-medium animate-pulse">🔴 Recording — your speech is being auto-typed above</p>
              )}
            </div>

            <Button onClick={submitAnswer} disabled={!currentAnswer.trim()} className="w-full gradient-accent text-accent-foreground h-12 rounded-xl">
              {currentQ < questions.length - 1 ? <>Next Question <ChevronRight className="w-4 h-4 ml-1" /></> : <>Submit & Get Feedback <CheckCircle2 className="w-4 h-4 ml-1" /></>}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // RESULTS
  return (
    <div className="min-h-screen bg-pattern">
      <div className="container mx-auto px-4 lg:px-8 py-10 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-accent shadow-glow-accent flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Interview Results</h1>
            <p className="text-muted-foreground">AI-powered feedback on your performance</p>
          </div>
        </div>

        <div className="space-y-6 animate-fade-in">
          {/* Overall Score */}
          <div className={`card-elevated p-8 text-center ${(result?.overall_score || 0) >= 6 ? "border-success/30" : "border-warning/30"}`}>
            <p className="text-sm text-muted-foreground mb-2">Overall Score</p>
            <p className={`text-7xl font-display font-bold ${getScoreColor(result?.overall_score || 0)}`}>
              {result?.overall_score || 0}<span className="text-2xl text-muted-foreground">/10</span>
            </p>
          </div>

          {/* Per Question */}
          <div className="card-elevated p-6">
            <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" /> Question-by-Question
            </h2>
            <div className="space-y-4">
              {questions.map((q, i) => {
                const pq = result?.per_question?.[i];
                return (
                  <div key={i} className="bg-secondary/30 rounded-xl p-4">
                    <p className="text-sm font-semibold text-foreground mb-1">Q{i + 1}: {q.question}</p>
                    <p className="text-xs text-muted-foreground mb-3 italic">Your answer: "{answers[i]?.substring(0, 100)}..."</p>
                    {pq && (
                      <>
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          {[
                            { label: "Relevance", val: pq.relevance },
                            { label: "Clarity", val: pq.clarity },
                            { label: "Complete", val: pq.completeness },
                          ].map((m) => (
                            <div key={m.label} className="text-center">
                              <p className="text-xs text-muted-foreground">{m.label}</p>
                              <p className={`text-lg font-bold ${getScoreColor(m.val)}`}>{m.val}/10</p>
                              <Progress value={m.val * 10} className="h-1.5 mt-1" />
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">💡 {pq.feedback}</p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card-elevated p-6">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-success" /> Strengths
              </h3>
              <ul className="space-y-2">
                {(result?.strengths || []).map((s, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" /> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-elevated p-6">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-warning" /> Improvements
              </h3>
              <ul className="space-y-2">
                {(result?.improvements || []).map((s, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-warning shrink-0 mt-0.5" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Overall Feedback */}
          <div className="card-elevated p-6">
            <h3 className="font-semibold text-foreground mb-3">📝 Overall Feedback</h3>
            <div className="space-y-2">
              {(result?.overall_feedback || []).map((f, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-primary/5">
                  <span className="text-primary font-bold">{i + 1}</span>
                  <p className="text-sm text-foreground">{f}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Button onClick={() => { setPhase("setup"); setResult(null); }} variant="outline" className="rounded-xl h-12 px-8">
              <RefreshCw className="w-4 h-4 mr-2" /> Try Another Interview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
