// lib/google-sheets.ts
import { google } from "googleapis";
import type { Student, Subject, RankingStudent } from "@/types";

export async function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  return sheets;
}

export async function getStudentResults(
  studentId: string,
  sheetName: string,
): Promise<Student | null> {
  const sheets = await getGoogleSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:Z`, // Get all columns
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return null;
    }

    // First row is headers
    const headers = rows[0];

    // Find the student row
    const studentRow = rows.slice(1).find((row) => row[0] === studentId);

    if (!studentRow) {
      return null;
    }

    // Extract class and term from sheet name (e.g., "SS2A-FirstTerm")
    const [className, term] = sheetName.split("-");

    // Build subjects array (skip Student ID, Name, and Total columns)
    const subjects: Subject[] = [];
    for (let i = 2; i < headers.length; i++) {
      const subjectName = headers[i];

      // Skip Total, Average, or any summary columns
      if (
        subjectName.toLowerCase() === "total" ||
        subjectName.toLowerCase() === "average" ||
        subjectName.toLowerCase() === "grade"
      ) {
        continue;
      }

      const score = parseFloat(studentRow[i]) || 0;
      subjects.push({
        subject: subjectName,
        score,
        grade: calculateGrade(score),
      });
    }

    // Calculate total and average
    const total = subjects.reduce((sum, s) => sum + s.score, 0);
    const average =
      subjects.length === 0 ? 0 : Math.round(total / subjects.length);

    return {
      studentId: studentRow[0],
      name: studentRow[1],
      class: className,
      term: term || "Unknown Term",
      subjects,
      total,
      average,
    };
  } catch (error) {
    console.error("Error fetching student results:", error);
    throw error;
  }
}

export async function getAllClassResults(
  sheetName: string,
): Promise<RankingStudent[]> {
  const sheets = await getGoogleSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:Z`,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return [];
    }

    const headers = rows[0];
    const [className, term] = sheetName.split("-");

    // Find Total column index
    const totalColumnIndex = headers.findIndex(
      (h) => h.toLowerCase() === "total",
    );

    // Process all student rows
    const students = rows.slice(1).map((row) => {
      const studentId = row[0];
      const name = row[1];

      // Get total score (either from Total column or calculate)
      let total = 0;
      if (totalColumnIndex !== -1 && row[totalColumnIndex]) {
        total = parseFloat(row[totalColumnIndex]) || 0;
      } else {
        // Calculate from subject columns
        for (let i = 2; i < headers.length; i++) {
          const header = headers[i].toLowerCase();
          if (
            header !== "total" &&
            header !== "average" &&
            header !== "grade"
          ) {
            total += parseFloat(row[i]) || 0;
          }
        }
      }

      // Count number of subjects
      const subjectCount = headers
        .slice(2)
        .filter(
          (h) => !["total", "average", "grade"].includes(h.toLowerCase()),
        ).length;

      const average = subjectCount === 0 ? 0 : Math.round(total / subjectCount);

      return {
        studentId,
        name,
        class: className,
        term: term || "Unknown Term",
        total,
        average,
      };
    });

    // Sort by total score (descending) and add position
    const rankedStudents = students
      .sort((a, b) => b.total - a.total)
      .map((student, index) => ({
        ...student,
        position: index + 1,
      }));

    return rankedStudents;
  } catch (error) {
    console.error("Error fetching class results:", error);
    throw error;
  }
}

export function calculateGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  if (score >= 50) return "E";
  return "F";
}

// Helper function to get all available sheet names (classes)
export async function getAvailableSheets(): Promise<string[]> {
  const sheets = await getGoogleSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const sheetNames = response.data.sheets
      ?.map((sheet) => sheet.properties?.title || "")
      .filter((name) => name !== "");

    return sheetNames || [];
  } catch (error) {
    console.error("Error fetching sheet names:", error);
    throw error;
  }
}
