// API configuration
// In production, set NEXT_PUBLIC_API_URL to your deployed URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function getApiUrl(path) {
  return `${API_BASE_URL}${path}`;
}
