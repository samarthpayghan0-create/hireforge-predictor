import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Mic, MicOff, ChevronRight, ChevronLeft, Zap, Target, TrendingUp,
  MessageSquare, Upload, FileText, X, CheckCircle2, ArrowRight, Briefcase
} from "lucide-react";

const interviewQuestions = [
  { id: 1, question: "Tell me about yourself.", category: "Introduction", tip: "Keep it concise — 60-90 seconds. Focus on education, skills, and what you bring." },
  { id: 2, question: "Why should we hire you?", category: "Motivation", tip: "Highlight your unique strengths and how they align with the role." },
  { id: 3, question: "What are your strengths and weaknesses?", category: "Self-awareness", tip: "Be honest about weaknesses and show how you're improving." },
  { id: 4, question: "Describe a challenging project you worked on.", category: "Experience", tip: "Use the STAR method: Situation, Task, Action, Result." },
  { id: 5, question: "Where do you see yourself in 5 years?", category: "Goals", tip: "Show ambition while staying realistic and relevant to the field." },
  { id: 6, question: "How do you handle pressure or tight deadlines?", category: "Problem Solving", tip: "Give a real example where you managed stress effectively." },
  { id: 7, question: "What motivates you to do your best work?", category: "Motivation", tip: "Be genuine — connect it to your passion for the field." },
  { id: 8, question: "Tell me about a time you worked in a team.", category: "Teamwork", tip: "Focus on collaboration, communication, and your specific role." },
  { id: 9, question: "Why are you interested in this industry?", category: "Industry Knowledge", tip: "Show genuine interest and awareness of industry trends." },
  { id: 10, question: "Do you have any questions for us?", category: "Closing", tip: "Always have 2-3 thoughtful questions prepared about the role or company." },
  { id: 11, question: "What is your greatest achievement so far?", category: "Experience", tip: "Pick something measurable and relevant to your career goals." },
  { id: 12, question: "How do you stay updated with technology trends?", category: "Learning", tip: "Mention specific resources, communities, or practices." },
  { id: 13, question: "Describe a situation where you had to learn something quickly.", category: "Adaptability", tip: "Show your learning process and the outcome." },
  { id: 14, question: "What makes you different from other candidates?", category: "Unique Value", tip: "Focus on a unique combination of skills or experiences." },
  { id: 15, question: "How do you prioritize your tasks?", category: "Organization", tip: "Describe your method — tools, frameworks, or strategies you use." },
];

function getRandomQuestions(count: number) {
  const shuffled = [...interviewQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function analyzeResponse(transcript: string, durationSec: number) {
  const words = transcript.trim().split(/\s+/).length;
  const wpm = Math.round((words / Math.max(durationSec, 1)) * 60);
  const fillers = (transcript.match(/\b(um|uh|like|you know|basically|actually|so yeah|i mean)\b/gi) || []).length;
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

  const speedScore = wpm >= 120 && wpm <= 160 ? 90 : wpm > 80 && wpm < 200 ? 70 : 40;
  const fluencyScore = Math.max(20, Math.min(100, 90 - fillers * 8));
  const clarityScore = Math.min(100, Math.round(sentences * 12 + words * 0.3));
  const confidenceScore = Math.min(100, Math.round((words / 15) * 20 + (1 - fillers / Math.max(words, 1)) * 50 + 20));
  const overall = Math.round((speedScore + fluencyScore + clarityScore + confidenceScore) / 4);

  return { speaking_speed: wpm, fluency_score: fluencyScore, clarity_score: clarityScore, confidence_score: confidenceScore, overall_score: overall };
}

export default function MockInterviewPage() {
  const { profileId, setCommResult } = useAppContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<"setup" | "interview" | "results">("setup");
  const [questions] = useState(() => getRandomQuestions(5));
  const [currentQ, setCurrentQ] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [scores, setScores] = useState<{ speaking_speed: number; fluency_score: number; clarity_score: number; confidence_score: number; overall_score: number }[]>([]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);

  const recognitionRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startRecording = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { toast.error("Speech recognition not supported. Try Chrome."); return; }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    let finalTranscript = "";

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript + " ";
        else interim += event.results[i][0].transcript;
      }
      setCurrentTranscript(finalTranscript + interim);
    };

    recognition.onerror = (e: any) => { toast.error("Recognition error: " + e.error); setIsRecording(false); };
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    startTimeRef.current = Date.now();
    recognition.start();
    setIsRecording(true);
    setCurrentTranscript("");
  }, []);

  const stopAndAnalyze = useCallback(() => {
    recognitionRef.current?.stop();
    setIsRecording(false);

    const durationSec = (Date.now() - startTimeRef.current) / 1000;
    const transcript = currentTranscript.trim();

    if (!transcript) {
      toast.error("No speech detected. Try again.");
      return;
    }

    const score = analyzeResponse(transcript, durationSec);
    setTranscripts(prev => [...prev, transcript]);
    setScores(prev => [...prev, score]);

    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setCurrentTranscript("");
    } else {
      // All questions done — calculate overall
      const allScores = [...scores, score];
      const avg = {
        speaking_speed: Math.round(allScores.reduce((a, s) => a + s.speaking_speed, 0) / allScores.length),
        fluency_score: Math.round(allScores.reduce((a, s) => a + s.fluency_score, 0) / allScores.length),
        clarity_score: Math.round(allScores.reduce((a, s) => a + s.clarity_score, 0) / allScores.length),
        confidence_score: Math.round(allScores.reduce((a, s) => a + s.confidence_score, 0) / allScores.length),
        overall_score: Math.round(allScores.reduce((a, s) => a + s.overall_score, 0) / allScores.length),
      };
      setCommResult({ ...avg, transcript: transcripts.join("\n\n") + "\n\n" + transcript });
      if (profileId) {
        supabase.from("communication_scores").insert({ profile_id: profileId, ...avg, transcript: transcripts.join("\n\n") + "\n\n" + transcript });
      }
      setPhase("results");
      toast.success("Mock interview complete!");
    }
  }, [currentTranscript, currentQ, questions, scores, transcripts, profileId, setCommResult]);

  const handleResumeUpload = async () => {
    if (!resumeFile || !user) return;
    setUploading(true);
    try {
      const ext = resumeFile.name.split(".").pop();
      const path = `${user.id}/resume.${ext}`;
      const { error } = await supabase.storage.from("resumes").upload(path, resumeFile, { upsert: true });
      if (error) throw error;
      
      // Save URL to profile
      if (profileId) {
        await supabase.from("student_profiles").update({ resume_url: path }).eq("id", profileId);
      }
      setResumeUploaded(true);
      toast.success("Resume uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  const overallScores = scores.length > 0 ? {
    speaking_speed: Math.round(scores.reduce((a, s) => a + s.speaking_speed, 0) / scores.length),
    fluency_score: Math.round(scores.reduce((a, s) => a + s.fluency_score, 0) / scores.length),
    clarity_score: Math.round(scores.reduce((a, s) => a + s.clarity_score, 0) / scores.length),
    confidence_score: Math.round(scores.reduce((a, s) => a + s.confidence_score, 0) / scores.length),
    overall_score: Math.round(scores.reduce((a, s) => a + s.overall_score, 0) / scores.length),
  } : null;

  // ========== SETUP PHASE ==========
  if (phase === "setup") {
    return (
      <div className="min-h-screen bg-pattern">
        <div className="container mx-auto px-4 lg:px-8 py-10 max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl gradient-warm flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Mock Interview</h1>
              <p className="text-muted-foreground">Practice with AI-powered interview simulation</p>
            </div>
          </div>

          <div className="card-elevated p-6 md:p-8 space-y-6 animate-fade-in">
            {/* Info */}
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground">How it works</h3>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1.5">
                    <li>• You'll be asked <strong>5 random interview questions</strong></li>
                    <li>• Record your answer for each question using your microphone</li>
                    <li>• Get scores on fluency, clarity, confidence, and speed</li>
                    <li>• Each session has different questions</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Resume upload */}
            <div className="bg-accent/5 rounded-2xl p-6 border border-accent/10">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground">Upload Resume <span className="text-xs text-muted-foreground font-normal">(Optional)</span></h3>
              </div>
              {resumeUploaded ? (
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Resume uploaded: {resumeFile?.name}</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-xl flex-1"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {resumeFile ? resumeFile.name : "Choose file (PDF, DOC)"}
                    </Button>
                    {resumeFile && (
                      <Button variant="ghost" size="icon" onClick={() => setResumeFile(null)} className="rounded-xl shrink-0">
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  {resumeFile && user && (
                    <Button onClick={handleResumeUpload} disabled={uploading} className="w-full gradient-accent text-accent-foreground rounded-xl">
                      {uploading ? "Uploading..." : "Upload Resume"}
                    </Button>
                  )}
                  {resumeFile && !user && (
                    <p className="text-xs text-muted-foreground">Sign in to save your resume</p>
                  )}
                </div>
              )}
            </div>

            <Button
              onClick={() => setPhase("interview")}
              className="w-full gradient-primary text-primary-foreground h-14 text-lg rounded-xl shadow-glow"
            >
              Start Mock Interview <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ========== INTERVIEW PHASE ==========
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
              <h1 className="text-xl md:text-2xl font-display font-bold text-foreground">Mock Interview</h1>
              <p className="text-muted-foreground text-sm">Question {currentQ + 1} of {questions.length}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex gap-2 mb-8">
            {questions.map((_, i) => (
              <div key={i} className={`flex-1 h-2 rounded-full transition-all ${
                i < currentQ ? "gradient-accent" : i === currentQ ? "gradient-primary" : "bg-secondary"
              }`} />
            ))}
          </div>

          <div className="card-elevated p-6 md:p-8 space-y-6 animate-fade-in">
            {/* Question */}
            <div>
              <span className="text-xs font-bold uppercase text-primary px-3 py-1 bg-primary/10 rounded-full">{q.category}</span>
              <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mt-3">"{q.question}"</h2>
              <p className="text-sm text-muted-foreground mt-2">💡 {q.tip}</p>
            </div>

            {/* Recording */}
            <div className="flex flex-col items-center py-4">
              <button
                onClick={isRecording ? stopAndAnalyze : startRecording}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isRecording
                    ? "bg-destructive animate-pulse scale-110"
                    : "gradient-primary shadow-glow hover:scale-105"
                }`}
              >
                {isRecording
                  ? <MicOff className="w-10 h-10 text-white" />
                  : <Mic className="w-10 h-10 text-white" />
                }
              </button>
              <p className="text-sm text-muted-foreground mt-3 font-medium">
                {isRecording ? "🔴 Recording... Click to stop & submit" : "Click to start answering"}
              </p>
            </div>

            {/* Live transcript */}
            {currentTranscript && (
              <div className="bg-secondary/50 rounded-2xl p-4">
                <p className="text-xs font-medium text-muted-foreground mb-1">Your Answer</p>
                <p className="text-sm text-foreground leading-relaxed">{currentTranscript}</p>
              </div>
            )}

            {/* Score for previous question */}
            {scores[currentQ - 1] && (
              <div className="bg-success/5 rounded-2xl p-4 border border-success/20">
                <p className="text-xs text-success font-semibold">✓ Previous answer scored: {scores[currentQ - 1].overall_score}%</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ========== RESULTS PHASE ==========
  return (
    <div className="min-h-screen bg-pattern">
      <div className="container mx-auto px-4 lg:px-8 py-10 max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-accent shadow-glow-accent flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Interview Complete!</h1>
            <p className="text-muted-foreground">Here's your performance breakdown</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Overall Score */}
          {overallScores && (
            <div className="card-elevated p-8 text-center animate-fade-in">
              <p className="text-sm text-muted-foreground mb-2">Overall Communication Score</p>
              <p className="text-7xl font-display font-bold text-gradient">{overallScores.overall_score}%</p>
              <p className={`text-lg font-semibold mt-2 ${overallScores.overall_score >= 70 ? "text-success" : overallScores.overall_score >= 40 ? "text-warning" : "text-destructive"}`}>
                {overallScores.overall_score >= 70 ? "Excellent Performance!" : overallScores.overall_score >= 40 ? "Good, Keep Practicing!" : "Needs More Practice"}
              </p>
            </div>
          )}

          {/* Skill Breakdown */}
          {overallScores && (
            <div className="card-elevated p-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-5">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-lg text-foreground">Skill Breakdown</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Speaking Speed", value: `${overallScores.speaking_speed}`, unit: "WPM", score: overallScores.speaking_speed > 80 ? 80 : 40 },
                  { label: "Fluency", value: `${overallScores.fluency_score}`, unit: "%", score: overallScores.fluency_score },
                  { label: "Clarity", value: `${overallScores.clarity_score}`, unit: "%", score: overallScores.clarity_score },
                  { label: "Confidence", value: `${overallScores.confidence_score}`, unit: "%", score: overallScores.confidence_score },
                ].map((item) => (
                  <div key={item.label} className="bg-secondary/50 rounded-2xl p-5 text-center">
                    <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                    <p className={`text-3xl font-bold ${item.score >= 70 ? "text-success" : item.score >= 40 ? "text-warning" : "text-destructive"}`}>
                      {item.value}<span className="text-lg">{item.unit}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Per-question breakdown */}
          <div className="card-elevated p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-5">
              <MessageSquare className="w-5 h-5 text-accent" />
              <h3 className="font-display font-semibold text-lg text-foreground">Question-wise Scores</h3>
            </div>
            <div className="space-y-3">
              {questions.map((q, i) => (
                <div key={q.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-xs text-primary font-semibold">{q.category}</p>
                    <p className="text-sm text-foreground truncate">{q.question}</p>
                  </div>
                  {scores[i] ? (
                    <span className={`text-lg font-bold shrink-0 ${scores[i].overall_score >= 70 ? "text-success" : scores[i].overall_score >= 40 ? "text-warning" : "text-destructive"}`}>
                      {scores[i].overall_score}%
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={() => {
                setPhase("setup");
                setCurrentQ(0);
                setTranscripts([]);
                setScores([]);
                setCurrentTranscript("");
              }}
              variant="outline"
              className="flex-1 h-12 rounded-xl"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Retry Interview
            </Button>
            <Button
              onClick={() => navigate("/dashboard")}
              className="flex-1 gradient-primary text-primary-foreground h-12 rounded-xl shadow-glow"
            >
              View Dashboard <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
