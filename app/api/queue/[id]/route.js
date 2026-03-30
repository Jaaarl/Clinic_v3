import { queueService } from "@/lib/services/queueService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";

export async function OPTIONS() { return handleOptions(); }

export async function GET(request, { params }) {
  try {
    const { id } = params;
    if (!id) return corsResponse({ error: "ID is required" }, 400);
    const { queueEntry, patient } = await queueService.getQueueWithPatient(id);
    return corsResponse({ queueEntry, patient });
  } catch (error) {
    console.error("Error fetching queue entry:", error);
    return corsResponse({ error: error.message || "Failed to fetch queue entry" }, 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    if (!id) return corsResponse({ error: "ID is required" }, 400);
    const deleted = await queueService.removeFromQueue(id);
    return corsResponse({ message: deleted ? "Queue entry deleted" : "Queue entry not found" });
  } catch (error) {
    console.error("Error deleting queue entry:", error);
    return corsResponse({ error: "Failed to delete queue entry" }, 500);
  }
}