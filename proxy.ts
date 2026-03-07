import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

<<<<<<< HEAD
const protectedPrefixes = ["/w", "/user", "/p", "/onboarding", "/setup"];
=======
const protectedPrefixes = ["/w", "/u",];
>>>>>>> prod

export async function proxy(req: NextRequest) {
  const { nextUrl } = req;
  const sessionCookie = getSessionCookie(req);

  const res = NextResponse.next();

  const isLoggedIn = !!sessionCookie;
  const isOnProtectedRoute = protectedPrefixes.some((prefix) =>
    nextUrl.pathname === prefix ||
    nextUrl.pathname.startsWith(prefix + "/")
  );
  const isOnAuthRoute = nextUrl.pathname.startsWith("/auth");

  if (isOnProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  if (isOnAuthRoute && isLoggedIn) {
<<<<<<< HEAD
    return NextResponse.redirect(new URL("/", req.url));
=======
    return NextResponse.redirect(new URL("/w", req.url));
>>>>>>> prod
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};