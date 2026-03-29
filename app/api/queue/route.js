import { queueService } from "@/lib/services/queueService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";

export async function OPTIONS() { return handleOptions(); }

export async function GET() {
  try {
    const queueEntries = await queueService.getQueueEntries();
    return corsResponse({ queueEntries });
  } catch (error) {
    console.error("Error fetching queue:", error);
    return corsResponse({ error: "Failed to fetch queue" }, 500);
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const result = await queueService.addToQueue(data);
    return corsResponse({ queueEntry: result.queueEntry, queueNumber: result.queueNum }, 201);
  } catch (error) {
    console.error("Error creating queue entry:", error);
    return corsResponse({ error: error.message || "Failed to create queue entry" }, 400);
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");
    if (!id) return corsResponse({ error: "ID is required" }, 400);
    const deleted = await queueService.removeFromQueue(id);
    return corsResponse({ message: deleted ? "Queue entry deleted" : "Queue entry not found" });
  } catch (error) {
    console.error("Error deleting queue entry:", error);
    return corsResponse({ error: "Failed to delete queue entry" }, 500);
  }
}
