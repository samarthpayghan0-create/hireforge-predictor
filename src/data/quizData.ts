import { aptitudeQuestions } from "./questions/aptitude";
import { programmingQuestions } from "./questions/programming";
import { dataStructuresQuestions } from "./questions/dataStructures";
import { coreSubjectsQuestions } from "./questions/coreSubjects";

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: "medium" | "hard";
}

// Combine all question banks into one pool
export const quizQuestions: QuizQuestion[] = [
  ...aptitudeQuestions,
  ...programmingQuestions,
  ...dataStructuresQuestions,
  ...coreSubjectsQuestions,
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export function getShuffledQuestionsForSection(
  categories: string[],
  difficulty: "medium" | "hard" | "mixed",
  count: number,
  seed?: number
): QuizQuestion[] {
  let pool = quizQuestions.filter(q => categories.includes(q.category));

  if (difficulty === "medium") {
    pool = pool.filter(q => q.difficulty === "medium");
  } else if (difficulty === "hard") {
    pool = pool.filter(q => q.difficulty === "hard");
  }

  // Use Date.now() as default seed so every attempt gets different questions
  const rng = seededRandom(seed ?? Date.now());
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, Math.min(count, shuffled.length)).map((q) => {
    const optionIndices = [0, 1, 2, 3];
    for (let i = 3; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [optionIndices[i], optionIndices[j]] = [optionIndices[j], optionIndices[i]];
    }
    const newOptions = optionIndices.map(idx => q.options[idx]);
    const newCorrect = optionIndices.indexOf(q.correctAnswer);
    return { ...q, options: newOptions, correctAnswer: newCorrect };
  });
}

// Legacy support
export function getShuffledQuestions(
  difficulty: "medium" | "hard" | "mixed",
  count: number,
  seed?: number
): QuizQuestion[] {
  return getShuffledQuestionsForSection(
    ["Aptitude", "Programming", "Data Structures", "DBMS", "Operating Systems"],
    difficulty, count, seed
  );
}
