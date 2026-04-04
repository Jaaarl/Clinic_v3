import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/api/clinic-info"];

const CORS_HEADERS = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
};

const getAllowedOrigin = () => {
  return process.env.ALLOWED_ORIGIN || "*";
};

const setCorsHeaders = (response) => {
  const origin = getAllowedOrigin();
  if (origin !== "*") {
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }
  response.headers.set("Access-Control-Allow-Origin", origin);
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
};

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow CORS preflight requests to pass through to route handlers
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
    const response = NextResponse.json(
      { error: "Unauthorized: Missing or invalid Authorization header" },
      { status: 401 }
    );
    return setCorsHeaders(response);
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix
  if (token !== expectedKey) {
    const response = NextResponse.json(
      { error: "Unauthorized: Invalid API key" },
      { status: 401 }
    );
    return setCorsHeaders(response);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
