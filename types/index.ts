// types/index.ts
export interface Student {
  studentId: string;
  name: string;
  class: string;
  term: string;
  subjects: Subject[];
  total: number;
  average: number;
}

export interface Subject {
  subject: string;
  score: number;
  grade: string;
}

export interface RankingStudent {
  studentId: string;
  name: string;
  class: string;
  term: string;
  total: number;
  average: number;
  position: number;
}

export interface User {
  id: string;
  name: string;
  role: "student" | "teacher";
  class?: string;
}
