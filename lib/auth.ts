import type { User } from "@/types";

// This is a simplified version - you should use NextAuth.js or similar in production
export function validateCredentials(
  username: string,
  password: string,
): User | null {
  // TODO: Replace with actual database lookup
  // For now, using student ID as username
  if (password === "password123") {
    // Demo password
    return {
      id: username,
      name: "Student Name", // This should come from database
      role: "student",
      class: "SS2A",
    };
  }
  return null;
}
