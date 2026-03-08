import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mic, MicOff, ChevronRight } from "lucide-react";

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

    // Speed score: 120-160 wpm is ideal
    const speedScore = wpm >= 120 && wpm <= 160 ? 90 : wpm > 80 && wpm < 200 ? 70 : 40;

    // Fluency: based on word count and filler detection
    const fillers = (transcript.match(/\b(um|uh|like|you know|basically|actually)\b/gi) || []).length;
    const fluencyScore = Math.max(20, Math.min(100, 90 - fillers * 10));

    // Clarity: based on average word length and vocabulary
    const avgWordLen = transcript.replace(/\s+/g, "").length / words;
    const clarityScore = Math.min(100, Math.round(avgWordLen * 15 + words * 0.5));

    // Confidence: longer responses with fewer fillers = more confident
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
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center">
          <Mic className="w-5 h-5 text-warning-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Voice Communication Analyzer</h1>
          <p className="text-sm text-muted-foreground">Record your answer to assess communication skills</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-6">
        <div className="bg-primary/5 rounded-xl p-5 border border-primary/10">
          <p className="text-sm text-muted-foreground mb-1">Interview Prompt:</p>
          <p className="text-lg font-display font-semibold text-foreground">"{prompt}"</p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              isRecording ? "bg-destructive animate-pulse-glow" : "gradient-primary shadow-glow hover:opacity-90"
            }`}
          >
            {isRecording ? <MicOff className="w-10 h-10 text-destructive-foreground" /> : <Mic className="w-10 h-10 text-primary-foreground" />}
          </button>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          {isRecording ? "Recording... Click to stop" : "Click to start recording"}
        </p>

        {transcript && (
          <div className="bg-secondary/50 rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Transcript:</p>
            <p className="text-foreground text-sm">{transcript}</p>
          </div>
        )}

        {transcript && !isRecording && !analyzed && (
          <Button onClick={analyzeVoice} className="w-full gradient-accent text-accent-foreground">Analyze Communication</Button>
        )}

        {analyzed && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="font-display font-semibold text-foreground">Analysis Results</h3>
            {[
              { label: "Speaking Speed", value: `${scores.speaking_speed} WPM`, score: scores.speaking_speed > 80 ? 80 : 40 },
              { label: "Fluency", value: `${scores.fluency_score}%`, score: scores.fluency_score },
              { label: "Clarity", value: `${scores.clarity_score}%`, score: scores.clarity_score },
              { label: "Confidence", value: `${scores.confidence_score}%`, score: scores.confidence_score },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between bg-secondary/30 rounded-lg p-3">
                <span className="text-sm font-medium text-foreground">{item.label}</span>
                <span className={`font-bold ${item.score >= 70 ? "text-success" : item.score >= 40 ? "text-warning" : "text-destructive"}`}>{item.value}</span>
              </div>
            ))}
            <div className="bg-primary/5 rounded-xl p-4 text-center border border-primary/10">
              <p className="text-sm text-muted-foreground">Overall Communication Score</p>
              <p className="text-4xl font-display font-bold text-primary">{scores.overall_score}%</p>
            </div>
            <Button onClick={() => navigate("/dashboard")} className="w-full gradient-primary text-primary-foreground">
              View Dashboard <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
