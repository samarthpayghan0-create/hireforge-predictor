import { useRef } from "react";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Download, Clock, BookOpen, Target, Rocket, Star, ArrowDown, GraduationCap, Sparkles } from "lucide-react";
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

const STEP_GRADIENTS = [
  { from: "#6366f1", to: "#818cf8", glow: "99,102,241" },
  { from: "#8b5cf6", to: "#a78bfa", glow: "139,92,246" },
  { from: "#d946ef", to: "#e879f9", glow: "217,70,239" },
  { from: "#f59e0b", to: "#fbbf24", glow: "245,158,11" },
  { from: "#10b981", to: "#34d399", glow: "16,185,129" },
  { from: "#3b82f6", to: "#60a5fa", glow: "59,130,246" },
  { from: "#ef4444", to: "#f87171", glow: "239,68,68" },
  { from: "#14b8a6", to: "#2dd4bf", glow: "20,184,166" },
];

const PRIORITY_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
  high: { bg: "rgba(239,68,68,0.12)", text: "#fca5a5", border: "rgba(239,68,68,0.25)", label: "🔥 High Priority" },
  medium: { bg: "rgba(245,158,11,0.12)", text: "#fcd34d", border: "rgba(245,158,11,0.25)", label: "⚡ Medium" },
  low: { bg: "rgba(16,185,129,0.12)", text: "#6ee7b7", border: "rgba(16,185,129,0.25)", label: "🌱 Low" },
};

export default function RoadmapVisual({ roadmap, careerGoal }: { roadmap: RoadmapResult; careerGoal: string }) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    try {
      toast.info("Generating high-res image...");
      const canvas = await html2canvas(canvasRef.current, {
        scale: 3,
        backgroundColor: "#050b18",
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `${(roadmap.career_goal || careerGoal).replace(/\s+/g, "_")}_Roadmap.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
      toast.success("Roadmap downloaded!");
    } catch {
      toast.error("Failed to generate image");
    }
  };

  const totalSteps = roadmap.roadmap.length;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleDownload} className="gradient-primary text-primary-foreground rounded-xl gap-2 shadow-lg">
          <Download className="w-4 h-4" /> Download Roadmap
        </Button>
      </div>

      <div className="overflow-auto rounded-2xl border border-border shadow-2xl">
        <div
          ref={canvasRef}
          style={{
            background: "linear-gradient(160deg, #050b18 0%, #0c1528 25%, #111d35 50%, #0a1628 75%, #050b18 100%)",
            padding: "56px 48px",
            minWidth: "920px",
            fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background decorative elements */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse 600px 400px at 20% 10%, rgba(99,102,241,0.08) 0%, transparent 70%), radial-gradient(ellipse 500px 300px at 80% 90%, rgba(217,70,239,0.06) 0%, transparent 70%)",
          }} />
          
          {/* Subtle grid pattern */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", opacity: 0.03,
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />

          {/* ── HEADER ── */}
          <div style={{ textAlign: "center", marginBottom: "48px", position: "relative" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
              padding: "6px 16px", borderRadius: "999px", marginBottom: "16px",
              fontSize: "12px", color: "#a5b4fc", fontWeight: 600, letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}>
              <Sparkles style={{ width: 13, height: 13 }} /> AI-Generated Roadmap
            </div>
            
            <h2 style={{
              fontSize: "36px", fontWeight: 800, margin: "0 0 8px 0",
              background: "linear-gradient(135deg, #ffffff 0%, #c7d2fe 50%, #a78bfa 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              letterSpacing: "-1px", lineHeight: 1.2,
            }}>
              {roadmap.career_goal || careerGoal}
            </h2>
            
            <p style={{ color: "#64748b", fontSize: "15px", margin: "0 0 20px 0", fontWeight: 400 }}>
              Your personalized learning journey • {totalSteps} steps • {roadmap.estimated_total_time}
            </p>

            {/* Progress indicator dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
              {roadmap.roadmap.map((_, i) => {
                const c = STEP_GRADIENTS[i % STEP_GRADIENTS.length];
                return (
                  <div key={i} style={{
                    width: "32px", height: "4px", borderRadius: "2px",
                    background: `linear-gradient(90deg, ${c.from}, ${c.to})`,
                    opacity: 0.7,
                  }} />
                );
              })}
            </div>
          </div>

          {/* ── ROADMAP STEPS ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0px", position: "relative" }}>
            {roadmap.roadmap.map((step, i) => {
              const gradient = STEP_GRADIENTS[i % STEP_GRADIENTS.length];
              const priority = PRIORITY_STYLES[step.priority] || PRIORITY_STYLES.medium;
              const isLast = i === totalSteps - 1;

              return (
                <div key={i} style={{ display: "flex", gap: "24px", position: "relative", paddingBottom: isLast ? "0" : "8px" }}>
                  
                  {/* ── LEFT: Timeline column ── */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "60px", flexShrink: 0 }}>
                    {/* Step circle */}
                    <div style={{
                      width: "52px", height: "52px", borderRadius: "16px",
                      background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: `0 4px 20px rgba(${gradient.glow}, 0.35), 0 0 40px rgba(${gradient.glow}, 0.15)`,
                      position: "relative", zIndex: 2,
                      border: "2px solid rgba(255,255,255,0.15)",
                    }}>
                      <span style={{ color: "#fff", fontWeight: 800, fontSize: "18px", letterSpacing: "-0.5px" }}>
                        {String(step.step).padStart(2, "0")}
                      </span>
                    </div>
                    
                    {/* Connector line */}
                    {!isLast && (
                      <div style={{
                        flex: 1, width: "2px", minHeight: "24px",
                        background: `linear-gradient(180deg, ${gradient.to}60, ${STEP_GRADIENTS[(i + 1) % STEP_GRADIENTS.length].from}60)`,
                      }} />
                    )}
                  </div>

                  {/* ── RIGHT: Card ── */}
                  <div style={{
                    flex: 1, marginBottom: isLast ? "0" : "16px",
                    background: "rgba(15, 23, 42, 0.6)",
                    backdropFilter: "blur(12px)",
                    border: `1px solid rgba(${gradient.glow}, 0.15)`,
                    borderRadius: "16px",
                    padding: "28px",
                    position: "relative",
                    overflow: "hidden",
                  }}>
                    {/* Card accent top line */}
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: "3px",
                      background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to}, transparent)`,
                    }} />

                    {/* Title + meta row */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
                      <h3 style={{
                        color: "#f1f5f9", fontSize: "19px", fontWeight: 700, margin: 0,
                        letterSpacing: "-0.3px", lineHeight: 1.3,
                      }}>
                        {step.title}
                      </h3>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
                        <span style={{
                          background: priority.bg, color: priority.text,
                          border: `1px solid ${priority.border}`,
                          padding: "4px 12px", borderRadius: "8px",
                          fontSize: "11px", fontWeight: 600, whiteSpace: "nowrap",
                        }}>
                          {priority.label}
                        </span>
                        <span style={{
                          display: "flex", alignItems: "center", gap: "5px",
                          color: "#94a3b8", fontSize: "12px", fontWeight: 500,
                          background: "rgba(148,163,184,0.08)",
                          border: "1px solid rgba(148,163,184,0.12)",
                          padding: "4px 12px", borderRadius: "8px",
                        }}>
                          <Clock style={{ width: 11, height: 11 }} />
                          {step.timeline}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p style={{
                      color: "#94a3b8", fontSize: "13.5px", margin: "0 0 16px 0",
                      lineHeight: "1.7", maxWidth: "640px",
                    }}>
                      {step.description}
                    </p>

                    {/* Topics */}
                    {step.topics?.length > 0 && (
                      <div style={{ marginBottom: "16px" }}>
                        <p style={{ color: "#475569", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px 0" }}>
                          Key Topics
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {step.topics.map((t) => (
                            <span key={t} style={{
                              background: `rgba(${gradient.glow}, 0.1)`,
                              color: gradient.to,
                              padding: "5px 14px", borderRadius: "8px",
                              fontSize: "12px", fontWeight: 600,
                              border: `1px solid rgba(${gradient.glow}, 0.18)`,
                              letterSpacing: "0.2px",
                            }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Resources */}
                    {step.resources?.length > 0 && (
                      <div>
                        <p style={{ color: "#475569", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px 0" }}>
                          Resources
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {step.resources.map((r, ri) => (
                            <span key={ri} style={{
                              display: "inline-flex", alignItems: "center", gap: "5px",
                              color: "#93c5fd", fontSize: "12px", fontWeight: 500,
                              background: "rgba(59,130,246,0.08)",
                              border: "1px solid rgba(59,130,246,0.15)",
                              padding: "5px 12px", borderRadius: "8px",
                            }}>
                              <BookOpen style={{ width: 11, height: 11, flexShrink: 0 }} />
                              {r.name}
                              <span style={{ color: "#475569", fontSize: "10px" }}>• {r.type}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── FOOTER ── */}
          <div style={{
            marginTop: "40px", padding: "28px",
            background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(217,70,239,0.06))",
            borderRadius: "16px",
            border: "1px solid rgba(99,102,241,0.12)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: "16px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
              }}>
                <GraduationCap style={{ color: "#fff", width: 24, height: 24 }} />
              </div>
              <div>
                <p style={{ color: "#e2e8f0", fontSize: "16px", fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>
                  Estimated Completion: {roadmap.estimated_total_time}
                </p>
                <p style={{ color: "#64748b", fontSize: "12px", margin: "4px 0 0 0" }}>
                  {totalSteps} learning milestones to achieve your goal
                </p>
              </div>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: "6px",
              color: "#475569", fontSize: "11px", fontWeight: 500,
            }}>
              <Star style={{ width: 12, height: 12 }} />
              HireForge Predictor • AI Career Guidance
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
