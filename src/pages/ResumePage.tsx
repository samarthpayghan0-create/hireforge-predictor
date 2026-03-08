import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  FileText, Upload, CheckCircle2, AlertTriangle, TrendingUp, Code,
  BookOpen, Briefcase, Award, Lightbulb, RefreshCw, X, Loader2
} from "lucide-react";

interface AnalysisResult {
  id: string;
  resume_score: number;
  skills_score: number;
  projects_score: number;
  experience_score: number;
  keywords_score: number;
  detected_skills: string[];
  missing_skills: string[];
  education: string[];
  projects: string[];
  certifications: string[];
  work_experience: string[];
  suggestions: string[];
}

export default function ResumePage() {
  const { user } = useAuth();
  const { profileId } = useAppContext();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f?.type === "application/pdf") setFile(f);
    else toast.error("Please upload a PDF file");
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f?.type === "application/pdf") setFile(f);
    else if (f) toast.error("Please upload a PDF file");
  };

  const extractTextFromPDF = async (pdfFile: File): Promise<string> => {
    // Read PDF as array buffer and extract text using basic parsing
    const buffer = await pdfFile.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let text = "";
    
    // Decode the bytes to a string to find text streams
    const rawStr = new TextDecoder("latin1").decode(bytes);
    
    // Extract text between BT and ET markers (PDF text objects)
    const textMatches = rawStr.match(/BT[\s\S]*?ET/g) || [];
    for (const block of textMatches) {
      const tjMatches = block.match(/\(([^)]*)\)\s*Tj/g) || [];
      const tdMatches = block.match(/\(([^)]*)\)/g) || [];
      for (const m of tdMatches) {
        const inner = m.slice(1, -1);
        if (inner.trim()) text += inner + " ";
      }
    }

    // Also try to extract from stream content
    const streamMatches = rawStr.match(/stream\r?\n([\s\S]*?)\r?\nendstream/g) || [];
    for (const stream of streamMatches) {
      const printable = stream.replace(/[^\x20-\x7E\n\r]/g, " ").replace(/\s+/g, " ").trim();
      if (printable.length > 20) {
        // Extract words that look like readable text
        const words = printable.match(/[A-Za-z]{2,}/g) || [];
        if (words.length > 5) text += " " + words.join(" ");
      }
    }

    // If basic extraction fails, send the raw text content for AI to parse
    if (text.trim().length < 50) {
      // Fallback: extract all printable ASCII
      const printable = rawStr.replace(/[^\x20-\x7E\n\r]/g, " ").replace(/\s+/g, " ");
      const words = printable.match(/[A-Za-z@.\-]{2,}/g) || [];
      text = words.join(" ");
    }

    return text.trim();
  };

  const analyzeResume = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    try {
      // Upload to storage
      let resumeUrl: string | null = null;
      if (user) {
        const filePath = `${user.id}/${Date.now()}_${file.name}`;
        const { error: uploadErr } = await supabase.storage.from("resumes").upload(filePath, file);
        if (!uploadErr) resumeUrl = filePath;
      }

      // Extract text
      const resumeText = await extractTextFromPDF(file);
      
      if (resumeText.length < 30) {
        toast.error("Could not extract text from PDF. Please ensure it's not a scanned image.");
        setLoading(false);
        return;
      }

      // Call edge function
      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body: {
          resumeText,
          profileId: profileId || null,
          userId: user?.id || null,
          resumeUrl,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult(data);
      toast.success("Resume analyzed successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to analyze resume");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) =>
    score >= 70 ? "text-success" : score >= 40 ? "text-warning" : "text-destructive";

  const getScoreLabel = (score: number) =>
    score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Average" : "Needs Work";

  return (
    <div className="min-h-screen bg-pattern">
      <div className="container mx-auto px-4 lg:px-8 py-10 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-primary shadow-glow flex items-center justify-center">
            <FileText className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Resume Analyzer</h1>
            <p className="text-muted-foreground">Upload your resume and get AI-powered feedback</p>
          </div>
        </div>

        {/* Upload Section */}
        {!result && (
          <div className="card-elevated p-6 md:p-8 animate-fade-in">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
                dragOver ? "border-primary bg-primary/5 scale-[1.01]" : file ? "border-success/50 bg-success/5" : "border-border hover:border-primary/50 hover:bg-primary/5"
              }`}
              onClick={() => document.getElementById("resume-input")?.click()}
            >
              <input
                id="resume-input"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileSelect}
              />
              {file ? (
                <div className="space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-success mx-auto" />
                  <p className="font-semibold text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4 mr-1" /> Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-12 h-12 text-muted-foreground/50 mx-auto" />
                  <p className="font-semibold text-foreground">Drop your resume here</p>
                  <p className="text-sm text-muted-foreground">or click to browse • PDF only • Max 20MB</p>
                </div>
              )}
            </div>

            <Button
              onClick={analyzeResume}
              disabled={!file || loading}
              className="w-full mt-6 gradient-primary text-primary-foreground h-14 text-lg rounded-xl shadow-glow"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing with AI...
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5 mr-2" /> Analyze Resume
                </>
              )}
            </Button>

            {loading && (
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Extracting text and analyzing with AI...</span>
                </div>
                <Progress value={undefined} className="h-2" />
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-fade-in">
            {/* Overall Score */}
            <div className={`card-elevated p-6 md:p-8 relative overflow-hidden ${
              result.resume_score >= 60 ? "border-success/30" : "border-warning/30"
            }`}>
              <div className={`absolute inset-0 ${result.resume_score >= 60 ? "bg-success/5" : "bg-warning/5"}`} />
              <div className="relative flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-center gap-5">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    result.resume_score >= 60 ? "gradient-accent shadow-glow-accent" : "gradient-warm"
                  }`}>
                    {result.resume_score >= 60 ? <CheckCircle2 className="w-8 h-8 text-white" /> : <AlertTriangle className="w-8 h-8 text-white" />}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Resume Score</p>
                    <p className={`text-2xl md:text-3xl font-display font-bold ${getScoreColor(result.resume_score)}`}>
                      {getScoreLabel(result.resume_score)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Score</p>
                  <p className={`text-5xl md:text-6xl font-display font-bold ${getScoreColor(result.resume_score)}`}>
                    {result.resume_score}<span className="text-2xl text-muted-foreground">/100</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Skills", score: result.skills_score, icon: Code, color: "primary" },
                { label: "Projects", score: result.projects_score, icon: BookOpen, color: "accent" },
                { label: "Experience", score: result.experience_score, icon: Briefcase, color: "warning" },
                { label: "Keywords", score: result.keywords_score, icon: TrendingUp, color: "success" },
              ].map((item) => (
                <div key={item.label} className="card-elevated p-5 text-center">
                  <item.icon className={`w-6 h-6 mx-auto mb-2 text-${item.color}`} />
                  <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                  <p className={`text-3xl font-display font-bold ${getScoreColor(item.score)}`}>{item.score}</p>
                  <Progress value={item.score} className="mt-3 h-2" />
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Detected Skills */}
              <div className="card-elevated p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <h2 className="font-display font-semibold text-lg text-foreground">Detected Skills ({result.detected_skills.length})</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.detected_skills.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 rounded-full text-sm font-medium bg-success/10 text-success border border-success/20">
                      {skill}
                    </span>
                  ))}
                  {result.detected_skills.length === 0 && (
                    <p className="text-muted-foreground text-sm">No industry skills detected</p>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="card-elevated p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  <h2 className="font-display font-semibold text-lg text-foreground">Missing Skills ({result.missing_skills.length})</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.missing_skills.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 rounded-full text-sm font-medium bg-destructive/10 text-destructive border border-destructive/20">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Education & Certs */}
              <div className="card-elevated p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-primary" />
                  <h2 className="font-display font-semibold text-lg text-foreground">Education & Certifications</h2>
                </div>
                <div className="space-y-2">
                  {result.education.map((e, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-0.5">🎓</span>
                      <span className="text-foreground">{e}</span>
                    </div>
                  ))}
                  {result.certifications.map((c, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-warning mt-0.5">📜</span>
                      <span className="text-foreground">{c}</span>
                    </div>
                  ))}
                  {result.education.length === 0 && result.certifications.length === 0 && (
                    <p className="text-muted-foreground text-sm">No education or certifications detected</p>
                  )}
                </div>
              </div>

              {/* Projects & Experience */}
              <div className="card-elevated p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-accent" />
                  <h2 className="font-display font-semibold text-lg text-foreground">Projects & Experience</h2>
                </div>
                <div className="space-y-2">
                  {result.projects.map((p, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-accent mt-0.5">🚀</span>
                      <span className="text-foreground">{p}</span>
                    </div>
                  ))}
                  {result.work_experience.map((w, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-0.5">💼</span>
                      <span className="text-foreground">{w}</span>
                    </div>
                  ))}
                  {result.projects.length === 0 && result.work_experience.length === 0 && (
                    <p className="text-muted-foreground text-sm">No projects or experience detected</p>
                  )}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="card-elevated p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <Lightbulb className="w-5 h-5 text-warning" />
                <h2 className="font-display font-semibold text-lg text-foreground">Suggestions to Improve</h2>
              </div>
              <div className="space-y-3">
                {result.suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-warning/5 border border-warning/10">
                    <span className="text-warning font-bold text-lg">{i + 1}</span>
                    <p className="text-sm text-foreground">{s}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Analyze Again */}
            <div className="text-center">
              <Button
                onClick={() => { setResult(null); setFile(null); }}
                variant="outline"
                className="rounded-xl h-12 px-8"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Analyze Another Resume
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
