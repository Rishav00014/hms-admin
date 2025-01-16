import { NextResponse } from "next/server";

export function middleware(request) {
  const { cookies } = request;
  const accessToken = cookies.get("access_token")?.value;

  const { pathname } = request.nextUrl;

  // If access_token and user_id are in cookies and user is trying to access /auth, redirect to home
  if (accessToken && pathname === "/auth") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If access_token is not in cookies and user is trying to access any route except /auth, redirect to /auth
  if (!accessToken && pathname !== "/auth") {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // For all other cases, continue with the request
  return NextResponse.next();
}

// Update the matcher to include all routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
