import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
};

/**
 * Create a response with CORS headers
 * @param {object} data - Response data
 * @param {number} status - HTTP status code
 * @returns {NextResponse}
 */
export function corsResponse(data, status = 200) {
  const response = NextResponse.json(data, { status });
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

/**
 * Handle CORS preflight OPTIONS request
 * @returns {NextResponse}
 */
export function handleOptions() {
  const response = new NextResponse(null, { status: 204 });
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}
