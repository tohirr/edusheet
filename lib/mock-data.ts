import type { RankingStudent, Student, User } from "@/types";

export const mockUsers: User[] = [
  { id: "STU001", name: "John Doe", role: "student", class: "SS2A" },
  { id: "STU002", name: "Jane Smith", role: "student", class: "SS2A" },
  { id: "STU003", name: "Mike Johnson", role: "student", class: "SS2A" },
  { id: "STU004", name: "Sarah Williams", role: "student", class: "SS2A" },
  { id: "STU005", name: "David Brown", role: "student", class: "SS2A" },
];

export const mockSheets = ["SS2 Report Sheet", "SS2A-FirstTerm", "SS2A-SecondTerm"];

const baseSubjects = [
  "Mathematics",
  "English Language",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
];

const subjectScores: Record<string, number[]> = {
  STU001: [85, 78, 92, 88, 75, 80],
  STU002: [95, 90, 93, 89, 86, 92],
  STU003: [70, 68, 72, 66, 69, 71],
  STU004: [88, 83, 85, 90, 80, 87],
  STU005: [77, 73, 74, 79, 72, 75],
};

const scoreToGrade = (score: number) => {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  if (score >= 50) return "E";
  return "F";
};

export const mockReports: Student[] = mockUsers.map((user) => {
  const scores = subjectScores[user.id] ?? [75, 75, 75, 75, 75, 75];
  const subjects = baseSubjects.map((subject, index) => {
    const score = scores[index] ?? 75;
    return { subject, score, grade: scoreToGrade(score) };
  });
  const total = subjects.reduce((sum, item) => sum + item.score, 0);
  const average = Math.round(total / subjects.length);

  return {
    studentId: user.id,
    name: user.name,
    class: user.class ?? "SS2A",
    term: "First Term",
    subjects,
    total,
    average,
  };
});

export const mockRanking: RankingStudent[] = mockReports
  .map((report) => ({
    studentId: report.studentId,
    name: report.name,
    class: report.class,
    term: report.term,
    total: report.total,
    average: report.average,
    position: 0,
  }))
  .sort((a, b) => b.total - a.total)
  .map((student, index) => ({
    ...student,
    position: index + 1,
  }));

export const mockReportById = (studentId: string) =>
  mockReports.find((report) => report.studentId === studentId) ?? null;
