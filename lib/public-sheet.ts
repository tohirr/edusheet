import type { RankingStudent, Student, Subject, User } from "@/types";

const DEFAULT_GID = "0";

type SheetData = {
  headers: string[];
  rows: string[][];
};

const normalizeHeader = (value: string) =>
  value.toLowerCase().replace(/\s+/g, "");

const getCsvUrl = () => {
  const explicit = process.env.NEXT_PUBLIC_SHEET_CSV_URL;
  if (explicit) return explicit;

  const sheetId = process.env.NEXT_PUBLIC_SHEET_ID;
  if (!sheetId) {
    throw new Error(
      "Missing NEXT_PUBLIC_SHEET_ID or NEXT_PUBLIC_SHEET_CSV_URL",
    );
  }
  const gid = process.env.NEXT_PUBLIC_SHEET_GID || DEFAULT_GID;
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
};

const parseCsv = (text: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && next === '"') {
      current += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(current.trim());
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (current.length > 0 || row.length > 0) {
        row.push(current.trim());
        rows.push(row);
        row = [];
        current = "";
      }
      continue;
    }

    current += char;
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current.trim());
    rows.push(row);
  }

  return rows;
};

export const fetchSheetData = async (): Promise<SheetData> => {
  const response = await fetch(getCsvUrl(), { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch sheet data");
  }
  const text = await response.text();
  const rows = parseCsv(text);
  if (rows.length === 0) {
    return { headers: [], rows: [] };
  }
  const [headers, ...dataRows] = rows;
  return { headers, rows: dataRows };
};

const scoreToGrade = (score: number) => {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  if (score >= 50) return "E";
  return "F";
};

const toNumber = (value?: string) => {
  const parsed = Number.parseFloat(value ?? "");
  return Number.isFinite(parsed) ? parsed : 0;
};

const buildStudents = (data: SheetData): Student[] => {
  if (!data.headers.length) return [];
  const normalized = data.headers.map(normalizeHeader);

  const studentIdIndex = (() => {
    const index = normalized.findIndex(
      (h) => h === "studentid" || h === "studentidno" || h === "id",
    );
    return index >= 0 ? index : 0;
  })();
  const nameIndex = normalized.findIndex((h) => h === "name");
  const classIndex = normalized.findIndex((h) => h === "class");
  const termIndex = normalized.findIndex((h) => h === "term");
  const totalIndex = normalized.findIndex((h) => h === "total");
  const averageIndex = normalized.findIndex((h) => h === "average");
  const rankIndex = normalized.findIndex((h) => h === "rank");

  const summaryIndexCandidates = [totalIndex, averageIndex, rankIndex].filter(
    (idx) => idx >= 0,
  );
  const summaryStart =
    summaryIndexCandidates.length > 0
      ? Math.min(...summaryIndexCandidates)
      : data.headers.length;

  const subjectStart = termIndex >= 0 ? termIndex + 1 : 4;
  const subjectIndices: number[] = [];
  for (let i = subjectStart; i < summaryStart; i += 1) {
    subjectIndices.push(i);
  }

  return data.rows
    .filter((row) => row.length > 0)
    .map((row) => {
      const studentId = row[studentIdIndex] ?? "";
      const name = row[nameIndex] ?? "";
      const className = row[classIndex] ?? "";
      const term = row[termIndex] ?? "";

      const subjects: Subject[] = subjectIndices
        .map((index) => {
          const subjectName = data.headers[index] || `Subject ${index + 1}`;
          const score = toNumber(row[index]);
          return { subject: subjectName, score, grade: scoreToGrade(score) };
        })
        .filter((subject) => subject.subject.trim().length > 0);

      const total = totalIndex >= 0 ? toNumber(row[totalIndex]) : 0;
      const computedTotal =
        total > 0
          ? total
          : subjects.reduce((sum, subject) => sum + subject.score, 0);
      const average =
        averageIndex >= 0
          ? toNumber(row[averageIndex])
          : subjects.length > 0
            ? computedTotal / subjects.length
            : 0;

      return {
        studentId,
        name,
        class: className,
        term,
        subjects,
        total: Math.round(computedTotal),
        average: Math.round(average * 100) / 100,
      };
    })
    .filter((student) => student.studentId);
};

export const getPublicUsers = async (): Promise<User[]> => {
  const data = await fetchSheetData();
  const students = buildStudents(data);
  return students.map((student) => ({
    id: student.studentId,
    name: student.name,
    role: "student",
    class: student.class,
  }));
};

export const getStudentReportFromSheet = async (
  studentId: string,
  term?: string,
): Promise<Student | null> => {
  const data = await fetchSheetData();
  const students = buildStudents(data);
  return (
    students.find(
      (student) =>
        student.studentId === studentId && (!term || student.term === term),
    ) ?? null
  );
};

export const getClassRankingFromSheet = async (
  className?: string,
  term?: string,
): Promise<RankingStudent[]> => {
  const data = await fetchSheetData();
  const students = buildStudents(data).filter((student) => {
    if (className && student.class !== className) return false;
    if (term && student.term !== term) return false;
    return true;
  });

  return students
    .map((student) => ({
      studentId: student.studentId,
      name: student.name,
      class: student.class,
      term: student.term,
      total: student.total,
      average: student.average,
      position: 0,
    }))
    .sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      return a.name.localeCompare(b.name);
    })
    .map((student, index) => ({ ...student, position: index + 1 }));
};

export const getAvailableTerms = async (className?: string) => {
  const data = await fetchSheetData();
  const students = buildStudents(data).filter((student) => {
    if (!className) return true;
    return student.class === className;
  });
  return Array.from(new Set(students.map((student) => student.term))).filter(
    Boolean,
  );
};

export const getAvailableClasses = async () => {
  const data = await fetchSheetData();
  const students = buildStudents(data);
  return Array.from(new Set(students.map((student) => student.class))).filter(
    Boolean,
  );
};
