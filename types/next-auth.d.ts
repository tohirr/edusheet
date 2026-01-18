import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Extends the built-in session user object
   */
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
