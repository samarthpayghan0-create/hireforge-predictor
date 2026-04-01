import { useState, useEffect } from "react";

const STREAK_KEY = "hireforge_streak";
const ACTIVITY_KEY = "hireforge_last_activity";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  activeDays: string[]; // last 7 days activity markers
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

function loadStreak(): StreakData {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { currentStreak: 0, longestStreak: 0, lastActivityDate: "", activeDays: [] };
}

function saveStreak(data: StreakData) {
  localStorage.setItem(STREAK_KEY, JSON.stringify(data));
}

export function useStreak() {
  const [streak, setStreak] = useState<StreakData>(loadStreak);

  useEffect(() => {
    // Check if streak needs to be reset (missed a day)
    const data = loadStreak();
    const today = getToday();
    const yesterday = getYesterday();
    
    if (data.lastActivityDate && data.lastActivityDate !== today && data.lastActivityDate !== yesterday) {
      // Streak broken
      data.currentStreak = 0;
      saveStreak(data);
      setStreak(data);
    }
  }, []);

  const recordActivity = () => {
    const data = loadStreak();
    const today = getToday();
    
    if (data.lastActivityDate === today) return data; // Already recorded today

    const yesterday = getYesterday();
    if (data.lastActivityDate === yesterday || data.lastActivityDate === today) {
      data.currentStreak += 1;
    } else {
      data.currentStreak = 1;
    }

    data.longestStreak = Math.max(data.longestStreak, data.currentStreak);
    data.lastActivityDate = today;
    
    if (!data.activeDays.includes(today)) {
      data.activeDays.push(today);
    }
    // Keep only last 30 days
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    data.activeDays = data.activeDays.filter(d => new Date(d) >= cutoff);

    saveStreak(data);
    setStreak(data);
    return data;
  };

  const last7 = getLast7Days();
  const weekActivity = last7.map(day => ({
    date: day,
    label: new Date(day).toLocaleDateString("en", { weekday: "short" }),
    active: streak.activeDays.includes(day),
  }));

  return {
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    lastActivityDate: streak.lastActivityDate,
    weekActivity,
    recordActivity,
    isActiveToday: streak.lastActivityDate === getToday(),
  };
}
