import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  variant?: "default" | "primary" | "accent" | "warning";
}

export default function StatCard({ title, value, subtitle, icon, variant = "default" }: StatCardProps) {
  const variantStyles = {
    default: "bg-card border-border",
    primary: "bg-card border-primary/20",
    accent: "bg-card border-accent/20",
    warning: "bg-card border-warning/20",
  };

  const iconStyles = {
    default: "bg-secondary text-foreground",
    primary: "gradient-primary text-primary-foreground",
    accent: "gradient-accent text-accent-foreground",
    warning: "gradient-warm text-warning-foreground",
  };

  return (
    <div className={`rounded-xl border p-5 shadow-sm animate-fade-in ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-display font-bold mt-1 text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconStyles[variant]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
