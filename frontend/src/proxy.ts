import { NextRequest, NextResponse } from "next/server";

// Pages that don't require authentication
const PUBLIC_PATHS = ["/login"];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("access_token")?.value;
    const isAuthenticated = !!accessToken;
    const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

    // 1. Not logged in + trying to access a protected page → redirect to /login
    if (!isAuthenticated && !isPublicPath) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 2. Already logged in + visiting /login → redirect to home
    if (isAuthenticated && pathname === "/login") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
