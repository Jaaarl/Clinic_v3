import { queueService } from "@/lib/services/queueService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";

export async function OPTIONS() { return handleOptions(); }

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