import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getSheetData } from "../../../lib/google-sheets";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Student ID",
      credentials: {
        studentId: {
          label: "Student ID",
          type: "text",
          placeholder: "e.g. 101",
        },
      },
      async authorize(credentials) {
        const rows = await getSheetData();
        if (!rows) return null;

        // Find student where ID (Column A) matches the input
        const student = rows.find((row) => row[0] === credentials?.studentId);

        if (student) {
          return { id: student[0], name: student[1] };
        }
        return null; // Login failed
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
