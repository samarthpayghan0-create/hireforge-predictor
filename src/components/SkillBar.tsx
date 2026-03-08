interface SkillBarProps {
  label: string;
  value: number;
  max: number;
  color?: "primary" | "accent" | "warning" | "destructive" | "success";
}

export default function SkillBar({ label, value, max, color = "primary" }: SkillBarProps) {
  const pct = Math.round((value / max) * 100);

  const colorMap = {
    primary: "gradient-primary",
    accent: "gradient-accent",
    warning: "gradient-warm",
    destructive: "bg-destructive",
    success: "bg-success",
  };

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">{pct}%</span>
      </div>
      <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${colorMap[color]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
