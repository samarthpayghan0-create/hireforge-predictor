import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  variant?: "default" | "primary" | "accent" | "warning" | "success" | "destructive";
}

const variantStyles = {
  default: "bg-card",
  primary: "bg-primary/5 border-primary/20",
  accent: "bg-accent/5 border-accent/20",
  warning: "bg-warning/5 border-warning/20",
  success: "bg-success/5 border-success/20",
  destructive: "bg-destructive/5 border-destructive/20",
};

const iconStyles = {
  default: "bg-secondary text-muted-foreground",
  primary: "gradient-primary text-primary-foreground shadow-glow",
  accent: "gradient-accent text-accent-foreground shadow-glow-accent",
  warning: "gradient-warm text-white",
  success: "bg-success text-success-foreground",
  destructive: "bg-destructive text-destructive-foreground",
};

export default function StatCard({ title, value, subtitle, icon, variant = "default" }: StatCardProps) {
  return (
    <div className={cn(
      "rounded-2xl border p-5 transition-all duration-200 hover:shadow-lg",
      variantStyles[variant]
    )}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {icon && (
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
            iconStyles[variant]
          )}>
            {icon}
          </div>
        )}
      </div>
      <p className="text-3xl font-display font-bold text-foreground">{value}</p>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}
