// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validateCredentials } from "@/lib/auth";
import { mockUsers } from "@/lib/mock-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 },
      );
    }

    const useMocks = process.env.USE_MOCK_DATA === "true";
    const user = useMocks
      ? mockUsers.find((item) => item.id === username) ?? null
      : validateCredentials(username, password);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // In production, create a session/JWT token here
    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
