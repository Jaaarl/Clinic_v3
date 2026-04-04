import { appointmentService } from "@/lib/services/appointmentService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";

export async function OPTIONS() { return handleOptions(); }

export async function POST(request, { params }) {
  try {
    const queueEntry = await appointmentService.checkIn(params.id);
    return corsResponse({ message: "Patient checked in", queueEntry }, 201);
  } catch (error) {
    console.error("Error checking in patient:", error);
    return corsResponse({ error: error.message || "Failed to check in patient" }, 400);
  }
}
