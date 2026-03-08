import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Users, TrendingUp, TrendingDown, RefreshCw, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const ADMIN_PASSWORD = "sam@2005";

interface StudentRecord {
  id: string;
  name: string;
  cgpa: number;
  dsa_score: number;
  aptitude_score: number;
  num_projects: number;
  internship_experience: number;
  communication_rating: number;
  programming_skills: string[] | null;
  created_at: string;
  placement_probability?: number;
}

function calcPlacement(s: StudentRecord) {
  const cgpaNorm = (s.cgpa / 10) * 100;
  const projectNorm = Math.min(100, s.num_projects * 15);
  const internshipNorm = Math.min(100, s.internship_experience * 30);
  const commNorm = s.communication_rating * 10;
  const prob =
    cgpaNorm * 0.2 +
    s.dsa_score * 0.15 +
    s.aptitude_score * 0.15 +
    projectNorm * 0.1 +
    internshipNorm * 0.1 +
    50 * 0.15 +
    commNorm * 0.15;
  return Math.min(99, Math.max(5, Math.round(prob)));
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      toast.success("Access granted!");
    } else {
      toast.error("Incorrect password");
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("student_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setStudents(
        data.map((s) => ({
          ...s,
          programming_skills: s.programming_skills ?? [],
          placement_probability: calcPlacement(s as StudentRecord),
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) fetchStudents();
  }, [authenticated]);

  // ========== LOGIN SCREEN ==========
  if (!authenticated) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md">
        <div className="bg-card rounded-xl border border-border p-8 space-y-6 animate-fade-in">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full gradient-warm flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">Admin Access</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter password to access the admin panel</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Button type="submit" className="w-full gradient-primary text-primary-foreground">
              <Shield className="w-4 h-4 mr-2" /> Login
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // ========== ADMIN DASHBOARD ==========
  const placedCount = students.filter((s) => (s.placement_probability ?? 0) >= 60).length;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">All students who checked placement prediction</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchStudents} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setAuthenticated(false)}>
            Logout
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <Users className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-2xl font-display font-bold text-foreground">{students.length}</p>
          <p className="text-xs text-muted-foreground">Total Students</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <TrendingUp className="w-5 h-5 text-success mx-auto mb-1" />
          <p className="text-2xl font-display font-bold text-success">{placedCount}</p>
          <p className="text-xs text-muted-foreground">Likely Placed</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <TrendingDown className="w-5 h-5 text-destructive mx-auto mb-1" />
          <p className="text-2xl font-display font-bold text-destructive">{students.length - placedCount}</p>
          <p className="text-xs text-muted-foreground">Needs Improvement</p>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left p-3 font-semibold text-foreground">#</th>
                <th className="text-left p-3 font-semibold text-foreground">Name</th>
                <th className="text-center p-3 font-semibold text-foreground">CGPA</th>
                <th className="text-center p-3 font-semibold text-foreground">DSA</th>
                <th className="text-center p-3 font-semibold text-foreground">Aptitude</th>
                <th className="text-center p-3 font-semibold text-foreground">Projects</th>
                <th className="text-center p-3 font-semibold text-foreground">Internships</th>
                <th className="text-center p-3 font-semibold text-foreground">Prediction</th>
                <th className="text-center p-3 font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => {
                const placed = (s.placement_probability ?? 0) >= 60;
                return (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="p-3 text-muted-foreground">{i + 1}</td>
                    <td className="p-3 font-medium text-foreground">{s.name}</td>
                    <td className="p-3 text-center text-foreground">{s.cgpa}</td>
                    <td className="p-3 text-center text-foreground">{s.dsa_score}%</td>
                    <td className="p-3 text-center text-foreground">{s.aptitude_score}%</td>
                    <td className="p-3 text-center text-foreground">{s.num_projects}</td>
                    <td className="p-3 text-center text-foreground">{s.internship_experience}</td>
                    <td className="p-3 text-center font-bold">
                      <span className={placed ? "text-success" : "text-destructive"}>{s.placement_probability}%</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${placed ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                        {placed ? "Likely Placed" : "Needs Work"}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {students.length === 0 && !loading && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-muted-foreground">No students have checked their placement yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
