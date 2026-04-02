import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  FileText, Upload, CheckCircle2, AlertTriangle, TrendingUp, Code,
  BookOpen, Briefcase, Award, Lightbulb, RefreshCw, X, Loader2, Shield,
  FileCheck, LayoutList, Zap, Mail, Phone, Linkedin, Github
} from "lucide-react";

interface ATSDetails {
  sections_found: string[];
  sections_missing: string[];
  action_verbs_used: number;
  quantified_achievements: number;
  word_count: number;
  bullet_points: number;
  has_email: boolean;
  has_phone: boolean;
  has_linkedin: boolean;
  has_github: boolean;
}

interface AnalysisResult {
  id: string;
  resume_score: number;
  skills_score: number;
  projects_score: number;
  experience_score: number;
  keywords_score: number;
  format_score?: number;
  section_score?: number;
  detected_skills: string[];
  missing_skills: string[];
  education: string[];
  projects: string[];
  certifications: string[];
  work_experience: string[];
  suggestions: string[];
  ats_details?: ATSDetails;
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
    const buffer = await pdfFile.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let text = "";
    const rawStr = new TextDecoder("latin1").decode(bytes);
    const textMatches = rawStr.match(/BT[\s\S]*?ET/g) || [];
    for (const block of textMatches) {
      const tdMatches = block.match(/\(([^)]*)\)/g) || [];
      for (const m of tdMatches) {
        const inner = m.slice(1, -1);
        if (inner.trim()) text += inner + " ";
      }
    }
    const streamMatches = rawStr.match(/stream\r?\n([\s\S]*?)\r?\nendstream/g) || [];
    for (const stream of streamMatches) {
      const printable = stream.replace(/[^\x20-\x7E\n\r]/g, " ").replace(/\s+/g, " ").trim();
      if (printable.length > 20) {
        const words = printable.match(/[A-Za-z]{2,}/g) || [];
        if (words.length > 5) text += " " + words.join(" ");
      }
    }
    if (text.trim().length < 50) {
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
      let resumeUrl: string | null = null;
      if (user) {
        const filePath = `${user.id}/${Date.now()}_${file.name}`;
        const { error: uploadErr } = await supabase.storage.from("resumes").upload(filePath, file);
        if (!uploadErr) resumeUrl = filePath;
      }

      const resumeText = await extractTextFromPDF(file);

      if (resumeText.length < 30) {
        toast.error("Could not extract text from PDF. Please ensure it's not a scanned image.");
        setLoading(false);
        return;
      }

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
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">ATS Resume Analyzer</h1>
            <p className="text-muted-foreground">Industry-standard ATS scoring used by TCS, Infosys & more</p>
          </div>
        </div>

        {/* Upload Section */}
        {!result && (
          <div className="space-y-6 animate-fade-in">
            <div className="card-elevated p-6 md:p-8">
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
                  dragOver ? "border-primary bg-primary/5 scale-[1.01]" : file ? "border-success/50 bg-success/5" : "border-border hover:border-primary/50 hover:bg-primary/5"
                }`}
                onClick={() => document.getElementById("resume-input")?.click()}
              >
                <input id="resume-input" type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
                {file ? (
                  <div className="space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-success mx-auto" />
                    <p className="font-semibold text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-destructive hover:text-destructive">
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

              <div className="flex items-start gap-2.5 mt-5 p-3 rounded-xl bg-success/5 border border-success/15">
                <Shield className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your resume is analysed privately and <strong className="text-foreground">never stored or shared</strong> with third parties. All processing happens securely via AI.
                </p>
              </div>

              <Button onClick={analyzeResume} disabled={!file || loading} className="w-full mt-4 gradient-primary text-primary-foreground h-14 text-lg rounded-xl shadow-glow">
                {loading ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing with ATS Engine...</>) : (<><TrendingUp className="w-5 h-5 mr-2" /> Analyze Resume</>)}
              </Button>

              {loading && (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Running ATS keyword matching, section analysis, and scoring...</span>
                  </div>
                  <Progress value={undefined} className="h-2" />
                </div>
              )}
            </div>

            {/* What You'll Get */}
            <div className="card-elevated p-6 md:p-8">
              <h2 className="font-display font-semibold text-lg text-foreground mb-5 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-warning" /> What You'll Get
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: TrendingUp, label: "ATS Score", desc: "Weighted score matching real ATS systems", color: "primary" },
                  { icon: Code, label: "Skill Matching", desc: "Industry keywords matched against 100+ skills", color: "accent" },
                  { icon: LayoutList, label: "Section Analysis", desc: "Checks for required resume sections", color: "warning" },
                  { icon: FileCheck, label: "Format Check", desc: "Action verbs, bullets, and readability", color: "success" },
                  { icon: Zap, label: "Impact Score", desc: "Quantified achievements and measurable results", color: "primary" },
                  { icon: Award, label: "Suggestions", desc: "Actionable tips to pass ATS filters", color: "accent" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-border bg-secondary/30 p-4 text-center space-y-2">
                    <div className={`w-10 h-10 rounded-xl bg-${item.color}/10 border border-${item.color}/20 mx-auto flex items-center justify-center`}>
                      <item.icon className={`w-5 h-5 text-${item.color}`} />
                    </div>
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="card-elevated p-6 md:p-8">
              <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" /> Tips for a Stronger Resume
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  "Use action verbs like 'Built', 'Led', 'Designed' to describe achievements",
                  "Include measurable outcomes (e.g. 'Reduced load time by 40%')",
                  "List relevant technical skills and tools prominently",
                  "Keep it to 1–2 pages — recruiters spend ~7 seconds scanning",
                  "Add links to GitHub, LinkedIn, or portfolio projects",
                  "Tailor your resume keywords to the job description",
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                    <span className="text-primary font-bold text-sm shrink-0">{i + 1}</span>
                    <p className="text-sm text-muted-foreground">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── Results ─── */}
        {result && (
          <div className="space-y-6 animate-fade-in">
            {/* Overall Score */}
            <div className={`card-elevated p-6 md:p-8 relative overflow-hidden ${result.resume_score >= 60 ? "border-success/30" : "border-warning/30"}`}>
              <div className={`absolute inset-0 ${result.resume_score >= 60 ? "bg-success/5" : "bg-warning/5"}`} />
              <div className="relative flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-center gap-5">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${result.resume_score >= 60 ? "gradient-accent shadow-glow-accent" : "gradient-warm"}`}>
                    {result.resume_score >= 60 ? <CheckCircle2 className="w-8 h-8 text-white" /> : <AlertTriangle className="w-8 h-8 text-white" />}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">ATS Resume Score</p>
                    <p className={`text-2xl md:text-3xl font-display font-bold ${getScoreColor(result.resume_score)}`}>
                      {getScoreLabel(result.resume_score)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Scored using industry-standard ATS criteria</p>
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

            {/* Score Breakdown — 6 categories */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Skills", score: result.skills_score, icon: Code, weight: "25%" },
                { label: "Experience", score: result.experience_score, icon: Briefcase, weight: "20%" },
                { label: "Sections", score: result.section_score ?? 0, icon: LayoutList, weight: "15%" },
                { label: "Projects", score: result.projects_score, icon: BookOpen, weight: "15%" },
                { label: "Keywords", score: result.keywords_score, icon: TrendingUp, weight: "15%" },
                { label: "Formatting", score: result.format_score ?? 0, icon: FileCheck, weight: "10%" },
              ].map((item) => (
                <div key={item.label} className="card-elevated p-5 text-center">
                  <item.icon className={`w-6 h-6 mx-auto mb-2 ${getScoreColor(item.score)}`} />
                  <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                  <p className={`text-3xl font-display font-bold ${getScoreColor(item.score)}`}>{item.score}</p>
                  <Progress value={item.score} className="mt-3 h-2" />
                  <p className="text-[10px] text-muted-foreground mt-1">Weight: {item.weight}</p>
                </div>
              ))}
            </div>

            {/* ATS Details Panel */}
            {result.ats_details && (
              <div className="card-elevated p-6 md:p-8">
                <h2 className="font-display font-semibold text-lg text-foreground mb-5 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-primary" /> ATS Compatibility Details
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Contact Info */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Email", found: result.ats_details.has_email, icon: Mail },
                        { label: "Phone", found: result.ats_details.has_phone, icon: Phone },
                        { label: "LinkedIn", found: result.ats_details.has_linkedin, icon: Linkedin },
                        { label: "GitHub", found: result.ats_details.has_github, icon: Github },
                      ].map((c) => (
                        <div key={c.label} className={`flex items-center gap-2 p-2 rounded-lg text-sm ${c.found ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                          <c.icon className="w-4 h-4" />
                          <span>{c.label}</span>
                          {c.found ? <CheckCircle2 className="w-3.5 h-3.5 ml-auto" /> : <X className="w-3.5 h-3.5 ml-auto" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sections Found / Missing */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">Resume Sections</h3>
                    <div className="space-y-1.5">
                      {result.ats_details.sections_found.map((s) => (
                        <div key={s} className="flex items-center gap-2 text-sm text-success">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {s}
                        </div>
                      ))}
                      {result.ats_details.sections_missing.map((s) => (
                        <div key={s} className="flex items-center gap-2 text-sm text-destructive">
                          <X className="w-3.5 h-3.5" /> {s} <span className="text-xs text-muted-foreground">(missing)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Action Verbs", value: result.ats_details.action_verbs_used, target: "8+", icon: Zap },
                      { label: "Quantified Results", value: result.ats_details.quantified_achievements, target: "3+", icon: TrendingUp },
                      { label: "Bullet Points", value: result.ats_details.bullet_points, target: "10+", icon: LayoutList },
                      { label: "Word Count", value: result.ats_details.word_count, target: "300-700", icon: FileText },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-xl border border-border bg-secondary/30 p-3 text-center">
                        <stat.icon className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                        <p className="text-[10px] text-muted-foreground">Target: {stat.target}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Detected Skills */}
              <div className="card-elevated p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <h2 className="font-display font-semibold text-lg text-foreground">Detected Skills ({result.detected_skills.length})</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.detected_skills.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 rounded-full text-sm font-medium bg-success/10 text-success border border-success/20">{skill}</span>
                  ))}
                  {result.detected_skills.length === 0 && <p className="text-muted-foreground text-sm">No industry skills detected</p>}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="card-elevated p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  <h2 className="font-display font-semibold text-lg text-foreground">Skills Gap ({result.missing_skills.length})</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.missing_skills.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 rounded-full text-sm font-medium bg-destructive/10 text-destructive border border-destructive/20">{skill}</span>
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
                    <div key={i} className="flex items-start gap-2 text-sm"><span className="text-primary mt-0.5">🎓</span><span className="text-foreground">{e}</span></div>
                  ))}
                  {result.certifications.map((c, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm"><span className="text-warning mt-0.5">📜</span><span className="text-foreground">{c}</span></div>
                  ))}
                  {result.education.length === 0 && result.certifications.length === 0 && <p className="text-muted-foreground text-sm">No education or certifications detected</p>}
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
                    <div key={i} className="flex items-start gap-2 text-sm"><span className="text-accent mt-0.5">🚀</span><span className="text-foreground">{p}</span></div>
                  ))}
                  {result.work_experience.map((w, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm"><span className="text-primary mt-0.5">💼</span><span className="text-foreground">{w}</span></div>
                  ))}
                  {result.projects.length === 0 && result.work_experience.length === 0 && <p className="text-muted-foreground text-sm">No projects or experience detected</p>}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="card-elevated p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <Lightbulb className="w-5 h-5 text-warning" />
                <h2 className="font-display font-semibold text-lg text-foreground">ATS Improvement Suggestions</h2>
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
              <Button onClick={() => { setResult(null); setFile(null); }} variant="outline" className="rounded-xl h-12 px-8">
                <RefreshCw className="w-4 h-4 mr-2" /> Analyze Another Resume
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
