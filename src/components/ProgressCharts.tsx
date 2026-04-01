import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";
import { TrendingUp, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  profileId: string | null;
}

export default function ProgressCharts({ profileId }: Props) {
  const [quizHistory, setQuizHistory] = useState<any[]>([]);
  const [codingHistory, setCodingHistory] = useState<any[]>([]);
  const [view, setView] = useState<"quiz" | "coding">("quiz");

  useEffect(() => {
    if (!profileId) return;

    supabase
      .from("quiz_scores")
      .select("category, score, total_questions, created_at")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) {
          const grouped = data.reduce((acc: Record<string, any[]>, row) => {
            const date = new Date(row.created_at).toLocaleDateString("en", { month: "short", day: "numeric" });
            if (!acc[date]) acc[date] = [];
            acc[date].push(row);
            return acc;
          }, {});
          const chartData = Object.entries(grouped).map(([date, scores]) => {
            const avg = Math.round(scores.reduce((a, s) => a + (s.score / s.total_questions) * 100, 0) / scores.length);
            return { date, score: avg, count: scores.length };
          });
          setQuizHistory(chartData.slice(-10));
        }
      });

    supabase
      .from("coding_submissions")
      .select("score, is_correct, created_at")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) {
          const grouped = data.reduce((acc: Record<string, any[]>, row) => {
            const date = new Date(row.created_at).toLocaleDateString("en", { month: "short", day: "numeric" });
            if (!acc[date]) acc[date] = [];
            acc[date].push(row);
            return acc;
          }, {});
          const chartData = Object.entries(grouped).map(([date, subs]) => ({
            date,
            solved: subs.filter(s => s.is_correct).length,
            total: subs.length,
            avgScore: Math.round(subs.reduce((a, s) => a + (s.score || 0), 0) / subs.length),
          }));
          setCodingHistory(chartData.slice(-10));
        }
      });
  }, [profileId]);

  const hasQuizData = quizHistory.length > 0;
  const hasCodingData = codingHistory.length > 0;

  if (!hasQuizData && !hasCodingData) {
    return (
      <div className="card-elevated p-6 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="font-display font-semibold text-lg text-foreground">Progress History</h2>
        </div>
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Complete quizzes or coding problems to see your progress charts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-elevated p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="font-display font-semibold text-lg text-foreground">Progress History</h2>
        </div>
        <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg">
          <Button
            size="sm"
            variant={view === "quiz" ? "default" : "ghost"}
            onClick={() => setView("quiz")}
            className={`text-xs h-7 rounded-md ${view === "quiz" ? "gradient-primary text-primary-foreground" : ""}`}
          >
            Quiz
          </Button>
          <Button
            size="sm"
            variant={view === "coding" ? "default" : "ghost"}
            onClick={() => setView("coding")}
            className={`text-xs h-7 rounded-md ${view === "coding" ? "gradient-primary text-primary-foreground" : ""}`}
          >
            Coding
          </Button>
        </div>
      </div>

      {view === "quiz" && hasQuizData && (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={quizHistory}>
              <defs>
                <linearGradient id="quizGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(250, 84%, 54%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(250, 84%, 54%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} className="fill-muted-foreground" />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Area type="monotone" dataKey="score" stroke="hsl(250, 84%, 54%)" fill="url(#quizGrad)" strokeWidth={2} name="Avg Score %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {view === "quiz" && !hasQuizData && (
        <p className="text-sm text-muted-foreground text-center py-8">No quiz history yet</p>
      )}

      {view === "coding" && hasCodingData && (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={codingHistory}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
              <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Bar dataKey="solved" fill="hsl(162, 72%, 45%)" radius={[6, 6, 0, 0]} name="Solved" />
              <Bar dataKey="total" fill="hsl(250, 84%, 54%)" radius={[6, 6, 0, 0]} name="Attempted" opacity={0.4} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {view === "coding" && !hasCodingData && (
        <p className="text-sm text-muted-foreground text-center py-8">No coding history yet</p>
      )}
    </div>
  );
}
