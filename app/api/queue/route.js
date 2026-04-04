import { queueService } from "@/lib/services/queueService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";

export async function OPTIONS() { return handleOptions(); }

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;
    const doctorId = searchParams.get("doctorId");

    const queue = doctorId
      ? await queueService.getDoctorQueue(doctorId)
      : await queueService.getTodayQueue();

    return corsResponse({ queue });
  } catch (error) {
    console.error("Error fetching queue:", error);
    return corsResponse({ error: "Failed to fetch queue" }, 500);
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { patientId, doctorId, appointmentId, visitReason } = data;

    if (!patientId || !doctorId) {
      return corsResponse({ error: "patientId and doctorId are required" }, 400);
    }

    const queueEntry = await queueService.addToQueue({
      patientId,
      doctorId,
      appointmentId,
      visitReason: visitReason || "Scheduled Appointment",
      queueType: appointmentId ? "SCHEDULED" : "WALK_IN",
    });

    return corsResponse({ message: "Added to queue", queueEntry }, 201);
  } catch (error) {
    console.error("Error adding to queue:", error);
    return corsResponse({ error: error.message || "Failed to add to queue" }, 400);
  }
}
