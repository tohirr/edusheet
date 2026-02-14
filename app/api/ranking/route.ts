import { NextRequest, NextResponse } from "next/server";
import { getAllClassResults } from "@/lib/google-sheets";
import { mockRanking } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sheetName = searchParams.get("sheet") || process.env.DEFAULT_SHEET_NAME;

    if (!sheetName) {
      return NextResponse.json(
        { error: "Sheet name is required (e.g., SS2 Report Sheet)" },
        { status: 400 },
      );
    }

    const useMocks = process.env.USE_MOCK_DATA === "true";
    const ranking = useMocks ? mockRanking : await getAllClassResults(sheetName);

    // Extract class and term from sheet name
    const [className, term] = sheetName.split("-");

    return NextResponse.json({
      class: className,
      term: term || "Unknown Term",
      totalStudents: ranking.length,
      ranking,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch class ranking" },
      { status: 500 },
    );
  }
}
