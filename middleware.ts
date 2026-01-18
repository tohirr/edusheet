import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

// Define which routes should be protected
export const config = {
  matcher: ["/dashboard/:path*", "/ranking/:path*"],
};
