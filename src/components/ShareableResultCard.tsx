import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Download, Share2, Trophy, Brain, BookOpen, Mic, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  name: string;
  placementProb: number;
  cgpa: number;
  quizPct: number;
  commScore: number;
  codingScore?: number;
}

export default function ShareableResultCard({ name, placementProb, cgpa, quizPct, commScore, codingScore }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const downloadCard = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `hireforge-${name.toLowerCase().replace(/\s+/g, "-")}-score.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Score card downloaded!");
    } catch {
      toast.error("Failed to generate image");
    } finally {
      setDownloading(false);
    }
  };

  const shareCard = async () => {
    if (!navigator.share) {
      toast.info("Use the download button to save and share manually");
      return;
    }
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 2 });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], "hireforge-score.png", { type: "image/png" });
        await navigator.share({ title: "My HireForge Score", files: [file] });
      });
    } catch {
      toast.error("Sharing cancelled");
    }
  };

  const placed = placementProb >= 60;

  return (
    <div className="card-elevated p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-primary" />
          <h2 className="font-display font-semibold text-lg text-foreground">Share Your Score</h2>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={shareCard} className="rounded-xl text-xs">
            <Share2 className="w-3.5 h-3.5 mr-1" /> Share
          </Button>
          <Button size="sm" onClick={downloadCard} disabled={downloading} className="rounded-xl text-xs gradient-primary text-primary-foreground">
            <Download className="w-3.5 h-3.5 mr-1" /> {downloading ? "..." : "Download"}
          </Button>
        </div>
      </div>

      {/* The card to capture */}
      <div ref={cardRef} className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(250,84%,54%), hsl(280,80%,55%), hsl(162,72%,50%))" }}>
        <div className="p-6 text-white">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6" />
              <span className="font-display font-bold text-lg">HireForge</span>
            </div>
            <span className="text-xs opacity-80">Placement Readiness</span>
          </div>

          {/* Name & Score */}
          <div className="text-center mb-6">
            <p className="text-sm opacity-80 mb-1">{name}</p>
            <p className="text-5xl font-display font-bold mb-1">{placementProb}%</p>
            <p className="text-sm font-medium">
              {placed ? "🎉 Placement Ready" : "📈 Building Skills"}
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Trophy, label: "CGPA", value: `${cgpa}/10` },
              { icon: BookOpen, label: "Quiz", value: quizPct > 0 ? `${quizPct}%` : "—" },
              { icon: Mic, label: "Communication", value: `${commScore}%` },
              { icon: Code, label: "Coding", value: codingScore !== undefined ? `${codingScore}` : "—" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/15 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3">
                <stat.icon className="w-4 h-4 opacity-80" />
                <div>
                  <p className="text-[10px] opacity-70 uppercase">{stat.label}</p>
                  <p className="font-bold text-sm">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <p className="text-center text-[10px] opacity-50 mt-4">hireforge-predictor.lovable.app</p>
        </div>
      </div>
    </div>
  );
}
