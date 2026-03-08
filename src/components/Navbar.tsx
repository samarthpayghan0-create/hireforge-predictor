import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  User, Brain, BarChart3, BookOpen, Mic, Sun, Moon, LogIn, LogOut,
  TrendingUp, Mail, FileText, Code, Compass, Settings, Menu, X, Briefcase, Map,
  Home, ArrowLeft
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

const navItems = [
  { path: "/", label: "Home", icon: BarChart3 },
  { path: "/resume", label: "Resume Analyzer", icon: FileText },
  { path: "/voice", label: "AI Mock Interview", icon: Mic },
  { path: "/coding", label: "Coding Challenge", icon: Code },
  { path: "/career", label: "Career Paths", icon: Compass },
  { path: "/quiz", label: "Learning Roadmap", icon: Map },
  { path: "/profile", label: "Predictor", icon: TrendingUp },
  { path: "/dashboard", label: "Progress Dashboard", icon: Brain },
];

export default function Navbar() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { profile } = useAppContext();
  const [lastPrediction, setLastPrediction] = useState<number | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("student_profiles")
      .select("name, cgpa, dsa_score, aptitude_score, num_projects, internship_experience, communication_rating, avatar_url")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setProfileName(data.name);
          setAvatarUrl((data as any).avatar_url || null);
          const cgpaNorm = (data.cgpa / 10) * 100;
          const projectNorm = Math.min(100, data.num_projects * 15);
          const internshipNorm = Math.min(100, data.internship_experience * 30);
          const prob = cgpaNorm * 0.2 + data.dsa_score * 0.15 + data.aptitude_score * 0.15 +
            projectNorm * 0.1 + internshipNorm * 0.1 + ((data.dsa_score + data.aptitude_score) / 2) * 0.15 +
            (data.communication_rating * 10) * 0.15;
          setLastPrediction(Math.min(99, Math.max(5, Math.round(prob))));
        }
      });
  }, [user, profile]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  return (
    <nav className="sticky top-0 z-50 glass-strong border-b border-border/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative">
              <img src="/logo.png" alt="HireForge" className="w-10 h-10 rounded-xl shadow-md transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 rounded-xl bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-display font-bold text-xl text-foreground tracking-tight hidden sm:inline">
              HireForge
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-[15px] font-semibold transition-all duration-200 whitespace-nowrap group ${
                    isActive
                      ? "gradient-primary text-primary-foreground shadow-glow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {/* Hover underline animation */}
                  {!isActive && (
                    <span className="absolute bottom-0.5 left-3 right-3 h-[2px] bg-primary rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side: Settings + Mobile hamburger */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Settings Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl w-10 h-10 border-border/50 bg-secondary/50 hover:bg-secondary shrink-0"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0 rounded-2xl overflow-hidden">
                {user ? (
                  <div className="gradient-primary p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {profileName || user.user_metadata?.full_name || "Student"}
                        </p>
                        <p className="text-xs text-white/70 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="gradient-primary p-4">
                    <p className="text-sm font-semibold text-white">Settings</p>
                    <p className="text-xs text-white/70">Customize your experience</p>
                  </div>
                )}

                <div className="p-3 space-y-2">
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-left"
                  >
                    {theme === "dark" ? <Moon className="w-4 h-4 text-muted-foreground shrink-0" /> : <Sun className="w-4 h-4 text-muted-foreground shrink-0" />}
                    <div className="flex-1">
                      <p className="text-[10px] uppercase text-muted-foreground font-semibold">Theme</p>
                      <p className="text-sm text-foreground">{theme === "dark" ? "Dark Mode" : "Light Mode"}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">Toggle</span>
                  </button>

                  {user && (
                    <>
                      <Link
                        to="/profile"
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                      >
                        <User className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div className="flex-1">
                          <p className="text-[10px] uppercase text-muted-foreground font-semibold">Profile</p>
                          <p className="text-sm text-foreground">View & edit your profile</p>
                        </div>
                      </Link>

                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/50">
                        <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase text-muted-foreground font-semibold">Email</p>
                          <p className="text-sm text-foreground truncate">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/50">
                        <TrendingUp className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div>
                          <p className="text-[10px] uppercase text-muted-foreground font-semibold">Last Prediction</p>
                          {lastPrediction !== null ? (
                            <p className={`text-sm font-bold ${lastPrediction >= 60 ? "text-success" : "text-destructive"}`}>
                              {lastPrediction}% — {lastPrediction >= 60 ? "Likely Placed" : "Needs Improvement"}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground">No prediction yet</p>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        onClick={handleSignOut}
                        className="w-full justify-start gap-2 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 mt-1"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </Button>
                    </>
                  )}

                  {!user && (
                    <Button asChild variant="default" className="w-full rounded-xl gap-2">
                      <Link to="/auth">
                        <LogIn className="w-4 h-4" /> Sign In
                      </Link>
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {/* Mobile hamburger */}
            <Button
              variant="outline"
              size="icon"
              className="xl:hidden rounded-xl w-10 h-10 border-border/50 bg-secondary/50 hover:bg-secondary shrink-0"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="xl:hidden border-t border-border/30 bg-background/95 backdrop-blur-xl animate-fade-in">
          <div className="container mx-auto px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
                    isActive
                      ? "gradient-primary text-primary-foreground shadow-glow"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
