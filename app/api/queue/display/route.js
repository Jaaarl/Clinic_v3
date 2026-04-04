import { queueService } from "@/lib/services/queueService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";

export async function OPTIONS() { return handleOptions(); }

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;
    const doctorId = searchParams.get("doctorId");

    const displayData = await queueService.getDisplayData(doctorId);
    return corsResponse({ displayData });
  } catch (error) {
    console.error("Error fetching display data:", error);
    return corsResponse({ error: "Failed to fetch display data" }, 500);
  }
}
