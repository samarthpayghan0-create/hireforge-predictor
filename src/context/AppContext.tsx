import React, { createContext, useContext, useState, ReactNode } from "react";

export interface StudentProfile {
  id?: string;
  name: string;
  cgpa: number;
  programming_skills: string[];
  dsa_score: number;
  aptitude_score: number;
  num_projects: number;
  internship_experience: number;
  technical_skills: string[];
  communication_rating: number;
}

export interface QuizScore {
  category: string;
  score: number;
  total_questions: number;
}

export interface CommunicationResult {
  speaking_speed: number;
  fluency_score: number;
  clarity_score: number;
  confidence_score: number;
  overall_score: number;
  transcript: string;
}

interface AppContextType {
  profile: StudentProfile | null;
  setProfile: (p: StudentProfile | null) => void;
  profileId: string | null;
  setProfileId: (id: string | null) => void;
  quizScores: QuizScore[];
  setQuizScores: (s: QuizScore[]) => void;
  commResult: CommunicationResult | null;
  setCommResult: (r: CommunicationResult | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [quizScores, setQuizScores] = useState<QuizScore[]>([]);
  const [commResult, setCommResult] = useState<CommunicationResult | null>(null);

  return (
    <AppContext.Provider value={{ profile, setProfile, profileId, setProfileId, quizScores, setQuizScores, commResult, setCommResult }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be within AppProvider");
  return ctx;
}
