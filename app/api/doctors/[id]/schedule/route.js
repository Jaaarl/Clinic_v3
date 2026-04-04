import { doctorScheduleService } from "@/lib/services/doctorScheduleService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";

export async function OPTIONS() { return handleOptions(); }

export async function GET(request, { params }) {
  try {
    const { searchParams } = request.nextUrl;
    const dayOfWeek = searchParams.get("dayOfWeek");

    let schedule;
    if (dayOfWeek !== null) {
      schedule = await doctorScheduleService.getScheduleForDay(params.id, parseInt(dayOfWeek));
    } else {
      schedule = await doctorScheduleService.getSchedule(params.id);
    }

    return corsResponse({ schedule });
  } catch (error) {
    console.error("Error fetching doctor schedule:", error);
    return corsResponse({ error: "Failed to fetch doctor schedule" }, 500);
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const schedules = await doctorScheduleService.upsertSchedule(params.id, data.schedules);
    return corsResponse({ message: "Schedule updated", schedules });
  } catch (error) {
    console.error("Error updating doctor schedule:", error);
    return corsResponse({ error: error.message || "Failed to update doctor schedule" }, 400);
  }
}
