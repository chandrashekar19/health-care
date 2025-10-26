import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up"],
  afterAuth(auth, req, evt) {
    const role = auth.sessionClaims?.metadata?.role;

    if (req.nextUrl.pathname.startsWith("/admin") && role !== "admin") {
      return Response.redirect(new URL("/", req.url));
    }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"],
};
