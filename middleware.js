// Auth middleware temporarily disabled for development
// Re-enable by setting API_KEY in .env and uncommenting auth checks

import { NextResponse } from "next/server";

export function middleware(request) {
  // Allow all requests through for now
  // Auth will be re-enabled later when needed
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
