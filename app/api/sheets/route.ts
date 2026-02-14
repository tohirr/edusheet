import { NextResponse } from "next/server";
import { getAvailableSheets } from "@/lib/google-sheets";
import { mockSheets } from "@/lib/mock-data";

export async function GET() {
  try {
    const useMocks = process.env.USE_MOCK_DATA === "true";
    const sheets = useMocks ? mockSheets : await getAvailableSheets();
    return NextResponse.json(sheets);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sheet list" },
      { status: 500 },
    );
  }
}
