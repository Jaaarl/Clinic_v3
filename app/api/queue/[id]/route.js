import { queueService } from "@/lib/services/queueService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";

export async function OPTIONS() { return handleOptions(); }

export async function GET(request, { params }) {
  try {
    const entry = await queueService.getQueueEntryById(params.id);
    if (!entry) {
      return corsResponse({ error: "Queue entry not found" }, 404);
    }
    // Extract patient from the populated patientId field
    const patient = entry.patientId;
    return corsResponse({ queueEntry: entry, patient });
  } catch (error) {
    console.error("Error fetching queue entry:", error);
    return corsResponse({ error: "Failed to fetch queue entry" }, 500);
  }
}

export async function PATCH(request, { params }) {
  try {
    const data = await request.json();
    const { action, changedBy } = data;

    let result;
    switch (action) {
      case "call":
        // This calls the next patient, not a specific ID
        result = await queueService.callNext(data.doctorId);
        return corsResponse({ message: "Patient called", queueEntry: result });

      case "start":
        result = await queueService.startConsultation(params.id);
        break;

      case "complete":
        result = await queueService.completeConsultation(params.id);
        break;

      case "no-show":
        result = await queueService.markNoShow(params.id);
        break;

      case "status":
        result = await queueService.updateStatus(params.id, data.status, changedBy);
        break;

      default:
        return corsResponse({ error: "Invalid action" }, 400);
    }

    return corsResponse({ message: `Action '${action}' completed`, queueEntry: result });
  } catch (error) {
    console.error("Error updating queue entry:", error);
    return corsResponse({ error: error.message || "Failed to update queue entry" }, 400);
  }
}
