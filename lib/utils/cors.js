import { NextResponse } from "next/server";

const getAllowedOrigin = () => {
  // In production, use a specific origin. Fallback to a reasonable default for development.
  const origin = process.env.ALLOWED_ORIGIN || "*";
  return origin;
};

const CORS_HEADERS = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
};

export function corsResponse(data, status = 200) {
  const response = NextResponse.json(data, { status });
  const origin = getAllowedOrigin();

  // Don't send credentials with wildcard origin
  if (origin !== "*") {
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }
  response.headers.set("Access-Control-Allow-Origin", origin);

  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export function handleOptions() {
  const response = new NextResponse(null, { status: 204 });
  const origin = getAllowedOrigin();

  if (origin !== "*") {
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }
  response.headers.set("Access-Control-Allow-Origin", origin);

  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}
