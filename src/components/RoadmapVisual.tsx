import { useRef } from "react";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Download, Clock, BookOpen, ExternalLink, CheckCircle2, Zap, Target, Rocket } from "lucide-react";
import { toast } from "sonner";

interface RoadmapStep {
  step: number;
  title: string;
  description: string;
  topics: string[];
  resources: { name: string; url: string; type: string }[];
  timeline: string;
  priority: string;
}

interface RoadmapResult {
  roadmap: RoadmapStep[];
  estimated_total_time: string;
  career_goal: string;
}

const STEP_COLORS = [
  { bg: "#6366f1", light: "#eef2ff", border: "#a5b4fc" },
  { bg: "#8b5cf6", light: "#f5f3ff", border: "#c4b5fd" },
  { bg: "#ec4899", light: "#fdf2f8", border: "#f9a8d4" },
  { bg: "#f59e0b", light: "#fffbeb", border: "#fcd34d" },
  { bg: "#10b981", light: "#ecfdf5", border: "#6ee7b7" },
  { bg: "#3b82f6", light: "#eff6ff", border: "#93c5fd" },
  { bg: "#ef4444", light: "#fef2f2", border: "#fca5a5" },
  { bg: "#14b8a6", light: "#f0fdfa", border: "#5eead4" },
];

const PRIORITY_BADGE: Record<string, { bg: string; text: string }> = {
  high: { bg: "#fef2f2", text: "#dc2626" },
  medium: { bg: "#fffbeb", text: "#d97706" },
  low: { bg: "#f0fdf4", text: "#16a34a" },
};

export default function RoadmapVisual({ roadmap, careerGoal }: { roadmap: RoadmapResult; careerGoal: string }) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    try {
      toast.info("Generating image...");
      const canvas = await html2canvas(canvasRef.current, {
        scale: 2,
        backgroundColor: "#0f172a",
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `${(roadmap.career_goal || careerGoal).replace(/\s+/g, "_")}_Roadmap.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Roadmap image downloaded!");
    } catch {
      toast.error("Failed to generate image");
    }
  };

  return (
    <div className="space-y-4">
      {/* Download Button */}
      <div className="flex justify-end">
        <Button onClick={handleDownload} className="gradient-primary text-primary-foreground rounded-xl gap-2">
          <Download className="w-4 h-4" /> Download Roadmap Image
        </Button>
      </div>

      {/* Visual Roadmap — captured as image */}
      <div className="overflow-auto rounded-2xl border border-border">
        <div
          ref={canvasRef}
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
            padding: "48px",
            minWidth: "900px",
            fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "12px" }}>
              <Rocket style={{ color: "#a78bfa", width: 32, height: 32 }} />
              <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#ffffff", margin: 0, letterSpacing: "-0.5px" }}>
                {roadmap.career_goal || careerGoal}
              </h2>
            </div>
            <p style={{ color: "#94a3b8", fontSize: "16px", margin: 0 }}>
              Personalized Learning Roadmap • {roadmap.estimated_total_time}
            </p>
            <div style={{ width: "80px", height: "4px", background: "linear-gradient(90deg, #6366f1, #ec4899)", borderRadius: "2px", margin: "16px auto 0" }} />
          </div>

          {/* Steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "relative" }}>
            {/* Vertical line */}
            <div
              style={{
                position: "absolute",
                left: "28px",
                top: "20px",
                bottom: "20px",
                width: "3px",
                background: "linear-gradient(180deg, #6366f1, #ec4899, #10b981)",
                borderRadius: "2px",
                opacity: 0.5,
              }}
            />

            {roadmap.roadmap.map((step, i) => {
              const color = STEP_COLORS[i % STEP_COLORS.length];
              const priorityStyle = PRIORITY_BADGE[step.priority] || PRIORITY_BADGE.medium;
              return (
                <div key={i} style={{ display: "flex", gap: "20px", position: "relative" }}>
                  {/* Step Number Circle */}
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      background: color.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      boxShadow: `0 0 20px ${color.bg}40`,
                      zIndex: 1,
                    }}
                  >
                    <span style={{ color: "#fff", fontWeight: 800, fontSize: "20px" }}>{step.step}</span>
                  </div>

                  {/* Card */}
                  <div
                    style={{
                      flex: 1,
                      background: "rgba(30, 41, 59, 0.8)",
                      border: `1px solid ${color.border}30`,
                      borderRadius: "16px",
                      padding: "24px",
                      borderLeft: `4px solid ${color.bg}`,
                    }}
                  >
                    {/* Title Row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                      <h3 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, margin: 0 }}>{step.title}</h3>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span
                          style={{
                            background: priorityStyle.bg,
                            color: priorityStyle.text,
                            padding: "3px 10px",
                            borderRadius: "999px",
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                          }}
                        >
                          {step.priority}
                        </span>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            color: "#94a3b8",
                            fontSize: "13px",
                            background: "rgba(148,163,184,0.1)",
                            padding: "3px 10px",
                            borderRadius: "999px",
                          }}
                        >
                          <Clock style={{ width: 12, height: 12 }} />
                          {step.timeline}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p style={{ color: "#cbd5e1", fontSize: "14px", margin: "0 0 14px 0", lineHeight: "1.6" }}>{step.description}</p>

                    {/* Topics */}
                    {step.topics?.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
                        {step.topics.map((t) => (
                          <span
                            key={t}
                            style={{
                              background: `${color.bg}20`,
                              color: color.border,
                              padding: "4px 12px",
                              borderRadius: "999px",
                              fontSize: "12px",
                              fontWeight: 600,
                              border: `1px solid ${color.bg}30`,
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Resources */}
                    {step.resources?.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {step.resources.map((r, ri) => (
                          <span
                            key={ri}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              color: "#60a5fa",
                              fontSize: "12px",
                              background: "rgba(96,165,250,0.1)",
                              padding: "4px 10px",
                              borderRadius: "8px",
                            }}
                          >
                            <BookOpen style={{ width: 11, height: 11 }} />
                            {r.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: "36px", padding: "20px", background: "rgba(99,102,241,0.1)", borderRadius: "12px", border: "1px solid rgba(99,102,241,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <Target style={{ color: "#a78bfa", width: 20, height: 20 }} />
              <span style={{ color: "#e2e8f0", fontSize: "16px", fontWeight: 600 }}>
                Total Estimated Time: {roadmap.estimated_total_time}
              </span>
            </div>
            <p style={{ color: "#64748b", fontSize: "12px", margin: "8px 0 0" }}>Generated by HireForge Predictor • AI-Powered Career Guidance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
