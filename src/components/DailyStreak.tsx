import { Flame, Trophy } from "lucide-react";
import { useStreak } from "@/hooks/useStreak";

export default function DailyStreak() {
  const { currentStreak, longestStreak, weekActivity, isActiveToday } = useStreak();

  return (
    <div className="card-elevated p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className={`w-5 h-5 ${currentStreak > 0 ? "text-warning" : "text-muted-foreground"}`} />
          <h2 className="font-display font-semibold text-lg text-foreground">Daily Streak</h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Trophy className="w-3.5 h-3.5" />
          Best: {longestStreak}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
          currentStreak > 0 ? "gradient-warm" : "bg-secondary"
        }`}>
          <span className={`text-2xl font-display font-bold ${
            currentStreak > 0 ? "text-white" : "text-muted-foreground"
          }`}>{currentStreak}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            {currentStreak === 0 ? "No active streak" :
             currentStreak === 1 ? "1 day streak!" :
             `${currentStreak} day streak! 🔥`}
          </p>
          <p className="text-xs text-muted-foreground">
            {isActiveToday ? "✅ Active today" : "Complete any activity to keep your streak"}
          </p>
        </div>
      </div>

      {/* Week grid */}
      <div className="flex gap-2 justify-between">
        {weekActivity.map((day) => (
          <div key={day.date} className="flex flex-col items-center gap-1.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              day.active 
                ? "gradient-primary shadow-glow" 
                : "bg-secondary border border-border"
            }`}>
              {day.active && <Flame className="w-4 h-4 text-primary-foreground" />}
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
