import { Link, useLocation } from "react-router-dom";
import { User, Brain, MessageSquare, BarChart3, BookOpen, Mic } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: BarChart3 },
  { path: "/profile", label: "Profile", icon: User },
  { path: "/quiz", label: "Quiz", icon: BookOpen },
  { path: "/voice", label: "Voice", icon: Mic },
  { path: "/dashboard", label: "Dashboard", icon: Brain },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">PlacePredict</span>
          </Link>
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "gradient-primary text-primary-foreground shadow-glow"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
