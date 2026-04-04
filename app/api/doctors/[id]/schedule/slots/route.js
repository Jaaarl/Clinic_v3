import { doctorScheduleService } from "@/lib/services/doctorScheduleService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";

export async function OPTIONS() { return handleOptions(); }

export async function GET(request, { params }) {
  try {
    const { searchParams } = request.nextUrl;
    const date = searchParams.get("date");

    if (!date) {
      return corsResponse({ error: "date parameter is required" }, 400);
    }

    const slots = await doctorScheduleService.getAvailableSlots(params.id, date);
    return corsResponse({ slots });
  } catch (error) {
    console.error("Error fetching slots:", error);
    return corsResponse({ error: "Failed to fetch slots" }, 500);
  }
}
