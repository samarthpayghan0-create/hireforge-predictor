import { Link, useLocation } from "react-router-dom";
import { User, Brain, BarChart3, BookOpen, Mic, Shield } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: BarChart3 },
  { path: "/profile", label: "Profile", icon: User },
  { path: "/quiz", label: "Quiz", icon: BookOpen },
  { path: "/voice", label: "Voice", icon: Mic },
  { path: "/dashboard", label: "Dashboard", icon: Brain },
  { path: "/admin", label: "Admin", icon: Shield },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 glass-strong border-b border-border/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img src="/logo.png" alt="HireForge" className="w-10 h-10 rounded-xl shadow-md transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 rounded-xl bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-display font-bold text-xl text-foreground tracking-tight">
              HireForge
            </span>
          </Link>
          
          <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-xl">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "gradient-primary text-primary-foreground shadow-glow"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/80"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
