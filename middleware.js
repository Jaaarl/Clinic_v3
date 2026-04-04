import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/api/clinic-info"];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow CORS preflight requests
  if (request.method === "OPTIONS") {
    return NextResponse.next();
  }

  // Allow public paths (no auth required)
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for API key in Authorization header
  const authHeader = request.headers.get("Authorization");
  const expectedKey = process.env.API_KEY;

  // If no API_KEY is configured, skip auth (development mode)
  if (!expectedKey) {
    return NextResponse.next();
  }

  // Verify Bearer token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Unauthorized: Missing or invalid Authorization header" },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix
  if (token !== expectedKey) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid API key" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
