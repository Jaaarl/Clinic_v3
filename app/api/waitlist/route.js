import { waitlistService } from "@/lib/services/waitlistService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";

export async function OPTIONS() { return handleOptions(); }

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;
    const doctorId = searchParams.get("doctorId");

    const waitlist = await waitlistService.getWaitlist(doctorId);
    return corsResponse({ waitlist });
  } catch (error) {
    console.error("Error fetching waitlist:", error);
    return corsResponse({ error: "Failed to fetch waitlist" }, 500);
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const entry = await waitlistService.addToWaitlist(data);
    return corsResponse({ message: "Added to waitlist", entry }, 201);
  } catch (error) {
    console.error("Error adding to waitlist:", error);
    return corsResponse({ error: error.message || "Failed to add to waitlist" }, 400);
  }
}
