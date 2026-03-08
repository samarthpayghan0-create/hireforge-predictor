import { Link, useLocation } from "react-router-dom";
import { User, Brain, BarChart3, BookOpen, Mic, Shield, Sun, Moon, LogIn, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  return (
    <nav className="sticky top-0 z-50 glass-strong border-b border-border/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img src="/logo.png" alt="HireForge" className="w-10 h-10 rounded-xl shadow-md transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 rounded-xl bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-display font-bold text-xl text-foreground tracking-tight hidden sm:inline">
              HireForge
            </span>
          </Link>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 bg-secondary/50 p-1 rounded-xl overflow-x-auto">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
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
            
            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-xl w-10 h-10 border-border/50 bg-secondary/50 hover:bg-secondary shrink-0"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-xl">
                  <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-foreground truncate max-w-[120px]">
                    {user.user_metadata?.full_name || user.email?.split("@")[0]}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  className="rounded-xl w-10 h-10 shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button asChild variant="outline" size="sm" className="rounded-xl shrink-0">
                <Link to="/auth">
                  <LogIn className="w-4 h-4 mr-1.5" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
