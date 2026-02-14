import { NextRequest, NextResponse } from "next/server";
import { getStudentResults } from "@/lib/google-sheets";
import { mockReportById } from "@/lib/mock-data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ studentId: string }> },
) {
  try {
    const { searchParams } = new URL(request.url);
    const { studentId: routeStudentId } = await params;
    const queryStudentId = searchParams.get("studentId");
    const studentId = routeStudentId || queryStudentId;
    const sheetName = searchParams.get("sheet");

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 },
      );
    }

    if (!sheetName) {
      return NextResponse.json(
        { error: "Sheet name is required (e.g., SS2A-FirstTerm)" },
        { status: 400 },
      );
    }

    // Fetch results from Google Sheets
    const useMocks = process.env.USE_MOCK_DATA === "true";
    const studentReport = useMocks
      ? mockReportById(studentId)
      : await getStudentResults(studentId, sheetName);

    if (!studentReport) {
      return NextResponse.json(
        { error: "No results found for this student" },
        { status: 404 },
      );
    }

    return NextResponse.json(studentReport);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch student report" },
      { status: 500 },
    );
  }
}
