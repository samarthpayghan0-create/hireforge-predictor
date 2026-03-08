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
  CheckCircle2, Loader2, RefreshCw, Target, Zap, AlertTriangle,
  Volume2, Clock, BarChart3, TrendingUp
} from "lucide-react";

interface PerQuestion { relevance: number; clarity: number; completeness: number; feedback: string }
interface CommunicationAnalysis {
  overall_communication_score: number;
  speaking_speed_score: number;
  speaking_speed_wpm: number;
  speaking_speed_feedback: string;
  clarity_score: number;
  clarity_feedback: string;
  confidence_score: number;
  confidence_feedback: string;
  filler_word_score: number;
  filler_word_count: number;
  filler_words_detected: string[];
  filler_feedback: string;
  pause_score: number;
  pause_feedback: string;
  sentence_structure_score: number;
  sentence_structure_feedback: string;
  strengths: string[];
  areas_to_improve: string[];
  tips: string[];
}
interface EvalResult {
  per_question: PerQuestion[];
  overall_score: number;
  overall_feedback: string[];
  strengths: string[];
  improvements: string[];
  communication_analysis: CommunicationAnalysis | null;
}

interface SpeechMetric {
  wordCount: number;
  durationSec: number;
  wpm: number;
  fillerCount: number;
  fillers: string[];
  pauseCount: number;
  inputMethod: "voice" | "text";
}

const FILLER_WORDS = ["um", "uh", "like", "you know", "basically", "actually", "so", "right", "well", "i mean", "kind of", "sort of"];

const CATEGORIES = [
  { id: "mixed", label: "Mixed", desc: "HR + Technical + Behavioral" },
  { id: "HR", label: "HR", desc: "Personal & situational" },
  { id: "Technical", label: "Technical", desc: "Tech concepts & problem solving" },
  { id: "Behavioral", label: "Behavioral", desc: "Past experiences & scenarios" },
];

function countFillers(text: string): { count: number; found: string[] } {
  const lower = text.toLowerCase();
  const found: string[] = [];
  let count = 0;
  for (const filler of FILLER_WORDS) {
    const regex = new RegExp(`\\b${filler}\\b`, "gi");
    const matches = lower.match(regex);
    if (matches) {
      count += matches.length;
      found.push(`${filler} (${matches.length})`);
    }
  }
  return { count, found };
}

export default function MockInterviewPage() {
  const { profileId, setCommResult } = useAppContext();
  const { user } = useAuth();

  const [phase, setPhase] = useState<"setup" | "loading" | "interview" | "evaluating" | "results">("setup");
  const [category, setCategory] = useState("mixed");
  const [questions, setQuestions] = useState<{ question: string; category: string; tip: string }[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [speechMetrics, setSpeechMetrics] = useState<SpeechMetric[]>([]);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [pauseCount, setPauseCount] = useState(0);
  const [usedVoice, setUsedVoice] = useState(false);
  const [result, setResult] = useState<EvalResult | null>(null);

  const recognitionRef = useRef<any>(null);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accumulatedTextRef = useRef<string>("");
  const interimRef = useRef<string>("");
  const stoppedManuallyRef = useRef(false);
  const setAnswerRef = useRef(setCurrentAnswer);
  setAnswerRef.current = setCurrentAnswer;

  const createRecognition = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return null;

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (e: any) => {
      if (stoppedManuallyRef.current) return;

      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = setTimeout(() => {
        setPauseCount(prev => prev + 1);
      }, 2000);

      // Process only from resultIndex onward to avoid re-reading old results
      let newFinal = "";
      let newInterim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          newFinal += transcript + " ";
        } else {
          newInterim += transcript;
        }
      }

      // When text becomes final, permanently save it
      if (newFinal) {
        accumulatedTextRef.current += newFinal;
      }

      interimRef.current = newInterim;
      setAnswerRef.current(accumulatedTextRef.current + newInterim);
    };

    recognition.onerror = (e: any) => {
      if (e.error === "no-speech" || e.error === "aborted") return;
      toast.error("Speech error: " + e.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      if (stoppedManuallyRef.current) {
        setIsRecording(false);
        if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
        return;
      }
      // Auto-restart after pause/timeout — accumulated text is already saved in ref
      interimRef.current = "";
      try {
        const newRec = createRecognition();
        if (newRec) {
          recognitionRef.current = newRec;
          newRec.start();
        } else {
          setIsRecording(false);
        }
      } catch {
        setIsRecording(false);
      }
    };

    return recognition;
  }, []);

  const startRecording = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { toast.error("Speech recognition not supported. Use Chrome."); return; }

    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
      recognitionRef.current = null;
    }

    stoppedManuallyRef.current = false;
    accumulatedTextRef.current = currentAnswer; // preserve existing typed text

    const recognition = createRecognition();
    if (!recognition) { toast.error("Speech recognition not supported."); return; }

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    setRecordingStartTime(Date.now());
    setPauseCount(0);
    setUsedVoice(true);
  }, [currentAnswer, createRecognition]);

  const stopRecording = useCallback(() => {
    stoppedManuallyRef.current = true;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
    // Update accumulated text with current answer for consistency
    setIsRecording(false);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
  }, []);

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
      setSpeechMetrics([]);
      setCurrentQ(0);
      setCurrentAnswer("");
      setPhase("interview");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate questions");
      setPhase("setup");
    }
  };

  const submitAnswer = () => {
    if (!currentAnswer.trim()) { toast.error("Please provide an answer"); return; }
    
    const answerText = currentAnswer.trim();
    const words = answerText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    
    // Calculate speech metrics for this answer
    let durationSec = 30; // default for typed
    if (usedVoice && recordingStartTime) {
      durationSec = Math.max(1, (Date.now() - recordingStartTime) / 1000);
    }
    const wpm = (wordCount / durationSec) * 60;
    const { count: fillerCount, found: fillers } = countFillers(answerText);

    const metric: SpeechMetric = {
      wordCount,
      durationSec,
      wpm,
      fillerCount,
      fillers,
      pauseCount,
      inputMethod: usedVoice ? "voice" : "text",
    };

    const newAnswers = [...answers, answerText];
    const newMetrics = [...speechMetrics, metric];
    setAnswers(newAnswers);
    setSpeechMetrics(newMetrics);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setCurrentAnswer("");
      setRecordingStartTime(null);
      setPauseCount(0);
      setUsedVoice(false);
    } else {
      evaluateInterview(newAnswers, newMetrics);
    }
  };

  const evaluateInterview = async (allAnswers: string[], allMetrics: SpeechMetric[]) => {
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
          speechMetrics: allMetrics,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data);

      // Update comm result in context with detailed analysis
      const commAnalysis = data.communication_analysis;
      const overallPct = commAnalysis 
        ? Math.round(commAnalysis.overall_communication_score * 10)
        : Math.round((data.overall_score || 0) * 10);
      
      setCommResult({
        speaking_speed: commAnalysis?.speaking_speed_wpm || 0,
        fluency_score: commAnalysis ? Math.round(commAnalysis.speaking_speed_score * 10) : overallPct,
        clarity_score: commAnalysis ? Math.round(commAnalysis.clarity_score * 10) : overallPct,
        confidence_score: commAnalysis ? Math.round(commAnalysis.confidence_score * 10) : overallPct,
        overall_score: overallPct,
        transcript: allAnswers.join("\n\n"),
      });

      setPhase("results");
      toast.success("Interview evaluated with communication analysis!");
    } catch (err: any) {
      toast.error(err.message || "Failed to evaluate");
      setPhase("interview");
    }
  };

  const getScoreColor = (s: number) => s >= 7 ? "text-success" : s >= 5 ? "text-warning" : "text-destructive";
  const getScoreBg = (s: number) => s >= 7 ? "bg-success/10" : s >= 5 ? "bg-warning/10" : "bg-destructive/10";

  // SETUP
  if (phase === "setup") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 lg:px-8 py-10 max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-foreground flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-background" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">AI Mock Interview</h1>
              <p className="text-muted-foreground">Practice with AI-generated questions & voice analysis</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6 animate-fade-in">
            <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground">How it works</h3>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• AI generates 5 interview questions for your chosen category</li>
                    <li>• Answer via <strong>voice recording</strong> for communication analysis</li>
                    <li>• AI evaluates relevance, clarity, completeness & <strong>speaking style</strong></li>
                    <li>• Get detailed communication scores: speed, filler words, confidence & more</li>
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

            <Button onClick={generateQuestions} className="w-full bg-foreground text-background hover:bg-foreground/90 h-14 text-lg rounded-xl">
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-lg font-semibold text-foreground">
            {phase === "loading" ? "Generating interview questions..." : "AI is analyzing your answers & communication style..."}
          </p>
          <p className="text-sm text-muted-foreground">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  // INTERVIEW
  if (phase === "interview") {
    const q = questions[currentQ];
    const currentWordCount = currentAnswer.trim().split(/\s+/).filter(Boolean).length;
    const currentFillers = countFillers(currentAnswer);
    
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 lg:px-8 py-10 max-w-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-foreground flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-background" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-display font-bold text-foreground">Mock Interview</h1>
              <p className="text-muted-foreground text-sm">Question {currentQ + 1} of {questions.length}</p>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            {questions.map((_, i) => (
              <div key={i} className={`flex-1 h-2 rounded-full ${i < currentQ ? "bg-success" : i === currentQ ? "bg-primary" : "bg-secondary"}`} />
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6 animate-fade-in">
            <div>
              <span className="text-xs font-bold uppercase text-primary px-3 py-1 bg-primary/10 rounded-full">{q?.category || category}</span>
              <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mt-3">"{q?.question}"</h2>
              {q?.tip && <p className="text-sm text-muted-foreground mt-2">💡 {q.tip}</p>}
            </div>

            {/* Voice-first prompt */}
            <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-accent">
                <Volume2 className="w-4 h-4" />
                Use voice recording for communication analysis
              </div>
              <p className="text-xs text-muted-foreground mt-1">Speak your answer clearly. AI will analyze your speaking speed, filler words, pauses, and confidence.</p>
            </div>

            {/* Voice Controls */}
            <div className="flex gap-3">
              {!isRecording ? (
                <Button
                  type="button"
                  onClick={startRecording}
                  className="flex-1 h-14 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold"
                >
                  <Mic className="w-5 h-5 mr-2" /> Start Speaking
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={stopRecording}
                  variant="destructive"
                  className="flex-1 h-14 rounded-xl text-base font-semibold animate-pulse"
                >
                  <MicOff className="w-5 h-5 mr-2" /> Stop Speaking
                </Button>
              )}
            </div>

            {isRecording && (
              <div className="flex items-center gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-xl">
                <span className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                <p className="text-sm text-destructive font-medium">Recording — speak your answer clearly</p>
              </div>
            )}

            {/* Live Transcript */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Your Answer</p>
              <Textarea
                value={currentAnswer}
                onChange={(e) => { if (!isRecording) setCurrentAnswer(e.target.value); }}
                placeholder={isRecording ? "🎙️ Listening... your speech will appear here" : "Your transcript will appear here, or type your answer..."}
                className={`min-h-[150px] rounded-xl text-base transition-all ${isRecording ? "border-destructive/50 bg-destructive/5 cursor-not-allowed" : ""}`}
                readOnly={isRecording}
              />
            </div>
              
            {/* Live speech stats */}
            {currentAnswer.trim().length > 0 && (
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" /> {currentWordCount} words
                </span>
                {currentFillers.count > 0 && (
                  <span className="flex items-center gap-1 text-warning">
                    <AlertTriangle className="w-3 h-3" /> {currentFillers.count} filler words
                  </span>
                )}
                {usedVoice && (
                  <span className="flex items-center gap-1">
                    <Mic className="w-3 h-3 text-success" /> Voice input
                  </span>
                )}
              </div>
            )}

            <Button onClick={submitAnswer} disabled={!currentAnswer.trim() || isRecording} className="w-full bg-foreground text-background hover:bg-foreground/90 h-12 rounded-xl">
              {currentQ < questions.length - 1 ? <>Next Question <ChevronRight className="w-4 h-4 ml-1" /></> : <>Submit & Analyze <CheckCircle2 className="w-4 h-4 ml-1" /></>}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // RESULTS
  const commAnalysis = result?.communication_analysis;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-10 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-success" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Interview Results</h1>
            <p className="text-muted-foreground">AI-powered feedback with communication analysis</p>
          </div>
        </div>

        <div className="space-y-6 animate-fade-in">
          {/* Score Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`rounded-2xl border border-border bg-card p-6 text-center`}>
              <p className="text-sm text-muted-foreground mb-2">Interview Score</p>
              <p className={`text-5xl font-display font-bold ${getScoreColor(result?.overall_score || 0)}`}>
                {result?.overall_score || 0}<span className="text-xl text-muted-foreground">/10</span>
              </p>
            </div>
            {commAnalysis && (
              <div className={`rounded-2xl border border-border bg-card p-6 text-center`}>
                <p className="text-sm text-muted-foreground mb-2">Communication Score</p>
                <p className={`text-5xl font-display font-bold ${getScoreColor(commAnalysis.overall_communication_score)}`}>
                  {commAnalysis.overall_communication_score}<span className="text-xl text-muted-foreground">/10</span>
                </p>
              </div>
            )}
          </div>

          {/* Communication Analysis */}
          {commAnalysis && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display font-semibold text-lg text-foreground mb-5 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-primary" /> Communication Style Analysis
              </h2>
              
              {/* Metric bars */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {[
                  { label: "Speaking Speed", score: commAnalysis.speaking_speed_score, feedback: commAnalysis.speaking_speed_feedback, extra: `${commAnalysis.speaking_speed_wpm} WPM` },
                  { label: "Clarity", score: commAnalysis.clarity_score, feedback: commAnalysis.clarity_feedback },
                  { label: "Confidence", score: commAnalysis.confidence_score, feedback: commAnalysis.confidence_feedback },
                  { label: "Filler Words", score: commAnalysis.filler_word_score, feedback: commAnalysis.filler_feedback, extra: `${commAnalysis.filler_word_count} found` },
                  { label: "Pause Pattern", score: commAnalysis.pause_score, feedback: commAnalysis.pause_feedback },
                  { label: "Sentence Structure", score: commAnalysis.sentence_structure_score, feedback: commAnalysis.sentence_structure_feedback },
                ].map((m, i) => (
                  <div key={i} className={`rounded-xl p-4 ${getScoreBg(m.score)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-foreground">{m.label}</span>
                      <div className="flex items-center gap-2">
                        {m.extra && <span className="text-xs text-muted-foreground font-mono">{m.extra}</span>}
                        <span className={`text-lg font-bold ${getScoreColor(m.score)}`}>{m.score}/10</span>
                      </div>
                    </div>
                    <Progress value={m.score * 10} className="h-2 mb-2" />
                    <p className="text-xs text-muted-foreground">{m.feedback}</p>
                  </div>
                ))}
              </div>

              {/* Filler words detected */}
              {commAnalysis.filler_words_detected?.length > 0 && (
                <div className="bg-warning/5 border border-warning/20 rounded-xl p-4 mb-4">
                  <p className="text-sm font-semibold text-foreground mb-2">Filler Words Detected</p>
                  <div className="flex flex-wrap gap-2">
                    {commAnalysis.filler_words_detected.map((w, i) => (
                      <span key={i} className="text-xs bg-warning/10 text-warning px-3 py-1.5 rounded-full font-medium">"{w}"</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Communication Strengths & Improvements */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-success/5 border border-success/20 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-success" /> Strengths
                  </h4>
                  <ul className="space-y-1.5">
                    {(commAnalysis.strengths || []).map((s, i) => (
                      <li key={i} className="text-xs text-muted-foreground">• {s}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-warning/5 border border-warning/20 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-warning" /> Areas to Improve
                  </h4>
                  <ul className="space-y-1.5">
                    {(commAnalysis.areas_to_improve || []).map((s, i) => (
                      <li key={i} className="text-xs text-muted-foreground">• {s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Tips */}
              {commAnalysis.tips?.length > 0 && (
                <div className="mt-4 bg-primary/5 border border-primary/10 rounded-xl p-4">
                  <p className="text-sm font-semibold text-foreground mb-2">💡 Improvement Tips</p>
                  <ul className="space-y-1.5">
                    {commAnalysis.tips.map((t, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-primary font-bold shrink-0">{i + 1}.</span> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Per Question */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" /> Question-by-Question
            </h2>
            <div className="space-y-4">
              {questions.map((q, i) => {
                const pq = result?.per_question?.[i];
                const metric = speechMetrics[i];
                return (
                  <div key={i} className="bg-secondary/30 rounded-xl p-4">
                    <p className="text-sm font-semibold text-foreground mb-1">Q{i + 1}: {q.question}</p>
                    <p className="text-xs text-muted-foreground mb-2 italic">"{answers[i]?.substring(0, 120)}..."</p>
                    
                    {/* Speech stats for this answer */}
                    {metric && (
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3 p-2 bg-secondary/50 rounded-lg">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {metric.durationSec.toFixed(0)}s</span>
                        <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /> {metric.wpm.toFixed(0)} WPM</span>
                        <span className="flex items-center gap-1">{metric.wordCount} words</span>
                        {metric.fillerCount > 0 && <span className="text-warning">{metric.fillerCount} fillers</span>}
                        <span className="capitalize">{metric.inputMethod}</span>
                      </div>
                    )}
                    
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
            <div className="rounded-2xl border border-border bg-card p-6">
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
            <div className="rounded-2xl border border-border bg-card p-6">
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
          <div className="rounded-2xl border border-border bg-card p-6">
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
            <Button onClick={() => { setPhase("setup"); setResult(null); setSpeechMetrics([]); }} variant="outline" className="rounded-xl h-12 px-8">
              <RefreshCw className="w-4 h-4 mr-2" /> Try Another Interview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
