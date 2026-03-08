import { cn } from "@/lib/utils";

interface SkillBarProps {
  label: string;
  value: number;
  max: number;
  color?: "primary" | "accent" | "success" | "warning" | "destructive";
}

const colorStyles = {
  primary: "gradient-primary",
  accent: "gradient-accent",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
};

export default function SkillBar({ label, value, max, color = "primary" }: SkillBarProps) {
  const percentage = Math.min(100, (value / max) * 100);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm font-bold text-muted-foreground">
          {value}{max === 100 ? "%" : `/${max}`}
        </span>
      </div>
      <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700 ease-out", colorStyles[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
