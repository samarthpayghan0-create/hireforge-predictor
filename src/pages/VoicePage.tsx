import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mic, MicOff, ChevronRight, Volume2, Zap, Target, TrendingUp } from "lucide-react";

const prompts = [
  "Tell me about yourself.",
  "Why should we hire you?",
  "Describe a challenging project you worked on.",
  "Where do you see yourself in 5 years?",
];

export default function VoicePage() {
  const { profileId, setCommResult } = useAppContext();
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [scores, setScores] = useState({ speaking_speed: 0, fluency_score: 0, clarity_score: 0, confidence_score: 0, overall_score: 0 });
  const [prompt] = useState(prompts[Math.floor(Math.random() * prompts.length)]);
  const recognitionRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);

  const startRecording = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { toast.error("Speech recognition not supported in this browser. Try Chrome."); return; }

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
      setTranscript(finalTranscript + interim);
    };

    recognition.onerror = (e: any) => { toast.error("Recognition error: " + e.error); setIsRecording(false); };
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    startTimeRef.current = Date.now();
    recognition.start();
    setIsRecording(true);
    setTranscript("");
    setAnalyzed(false);
  }, []);

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  }, []);

  const analyzeVoice = async () => {
    if (!transcript.trim()) { toast.error("No speech detected. Please record again."); return; }

    const durationSec = (Date.now() - startTimeRef.current) / 1000;
    const words = transcript.trim().split(/\s+/).length;
    const wpm = Math.round((words / durationSec) * 60);

    const speedScore = wpm >= 120 && wpm <= 160 ? 90 : wpm > 80 && wpm < 200 ? 70 : 40;
    const fillers = (transcript.match(/\b(um|uh|like|you know|basically|actually)\b/gi) || []).length;
    const fluencyScore = Math.max(20, Math.min(100, 90 - fillers * 10));
    const avgWordLen = transcript.replace(/\s+/g, "").length / words;
    const clarityScore = Math.min(100, Math.round(avgWordLen * 15 + words * 0.5));
    const confidenceScore = Math.min(100, Math.round((words / 20) * 30 + (1 - fillers / words) * 50 + 20));
    const overall = Math.round((speedScore + fluencyScore + clarityScore + confidenceScore) / 4);

    const result = { speaking_speed: wpm, fluency_score: fluencyScore, clarity_score: clarityScore, confidence_score: confidenceScore, overall_score: overall, transcript };

    setScores(result);
    setCommResult(result);
    setAnalyzed(true);

    if (profileId) {
      await supabase.from("communication_scores").insert({ profile_id: profileId, ...result });
    }
    toast.success("Voice analysis complete!");
  };

  return (
    <div className="min-h-screen bg-pattern">
      <div className="container mx-auto px-4 lg:px-8 py-10 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-warm flex items-center justify-center">
            <Mic className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Voice Analyzer</h1>
            <p className="text-muted-foreground">Assess your communication skills</p>
          </div>
        </div>

        <div className="card-elevated p-6 md:p-8 space-y-8">
          {/* Prompt */}
          <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="w-5 h-5 text-primary" />
              <p className="text-sm font-medium text-muted-foreground">Interview Prompt</p>
            </div>
            <p className="text-xl font-display font-semibold text-foreground">"{prompt}"</p>
          </div>

          {/* Recording button */}
          <div className="flex flex-col items-center py-6">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 ${
                isRecording 
                  ? "bg-destructive animate-pulse scale-110" 
                  : "gradient-primary shadow-glow hover:scale-105"
              }`}
            >
              {isRecording 
                ? <MicOff className="w-12 h-12 text-white" /> 
                : <Mic className="w-12 h-12 text-white" />
              }
            </button>
            <p className="text-sm text-muted-foreground mt-4 font-medium">
              {isRecording ? "🔴 Recording... Click to stop" : "Click to start recording"}
            </p>
          </div>

          {/* Transcript */}
          {transcript && (
            <div className="bg-secondary/50 rounded-2xl p-5">
              <p className="text-sm font-medium text-muted-foreground mb-2">Transcript</p>
              <p className="text-foreground leading-relaxed">{transcript}</p>
            </div>
          )}

          {/* Analyze button */}
          {transcript && !isRecording && !analyzed && (
            <Button onClick={analyzeVoice} className="w-full gradient-accent text-accent-foreground h-14 text-lg rounded-xl shadow-glow-accent">
              <Zap className="w-5 h-5 mr-2" /> Analyze Communication
            </Button>
          )}

          {/* Results */}
          {analyzed && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-lg text-foreground">Analysis Results</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Speaking Speed", value: `${scores.speaking_speed}`, unit: "WPM", score: scores.speaking_speed > 80 ? 80 : 40 },
                  { label: "Fluency", value: `${scores.fluency_score}`, unit: "%", score: scores.fluency_score },
                  { label: "Clarity", value: `${scores.clarity_score}`, unit: "%", score: scores.clarity_score },
                  { label: "Confidence", value: `${scores.confidence_score}`, unit: "%", score: scores.confidence_score },
                ].map((item) => (
                  <div key={item.label} className="bg-secondary/50 rounded-2xl p-5 text-center">
                    <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                    <p className={`text-3xl font-bold ${item.score >= 70 ? "text-success" : item.score >= 40 ? "text-warning" : "text-destructive"}`}>
                      {item.value}<span className="text-lg">{item.unit}</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* Overall score */}
              <div className="bg-primary/5 rounded-2xl p-6 text-center border border-primary/10">
                <p className="text-sm text-muted-foreground mb-2">Overall Communication Score</p>
                <p className="text-6xl font-display font-bold text-gradient">{scores.overall_score}%</p>
              </div>

              <Button onClick={() => navigate("/dashboard")} className="w-full gradient-primary text-primary-foreground h-14 text-lg rounded-xl shadow-glow">
                <TrendingUp className="w-5 h-5 mr-2" /> View Dashboard <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
