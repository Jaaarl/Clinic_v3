import { queueService } from "@/lib/services/queueService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";
import { validateRequired } from "@/lib/utils/validation";

export async function OPTIONS() {
  return handleOptions();
}

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
    const { valid, missing } = validateRequired(data, ["referenceId"]);

    if (!valid) {
      return corsResponse(
        { error: `Missing required fields: ${missing.join(", ")}` },
        400
      );
    }

    const { queueEntry, queueNum } = await queueService.addToQueue(data);
    return corsResponse({ queueEntry, queueNumber: queueNum }, 201);
  } catch (error) {
    console.error("Error creating queue entry:", error);
    return corsResponse({ error: "Failed to create queue entry" }, 500);
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");

    if (!id) {
      return corsResponse({ error: "ID is required" }, 400);
    }

    const deleted = await queueService.removeFromQueue(id);
    return corsResponse({
      message: deleted
        ? "Queue entry deleted"
        : "Queue entry not found",
    });
  } catch (error) {
    console.error("Error deleting queue entry:", error);
    return corsResponse({ error: "Failed to delete queue entry" }, 500);
  }
}
