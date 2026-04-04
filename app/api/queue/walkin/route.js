import { queueService } from "@/lib/services/queueService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";

export async function OPTIONS() { return handleOptions(); }

export async function POST(request) {
  try {
    const data = await request.json();
    const queueEntry = await queueService.addWalkIn(data);
    return corsResponse({ message: "Walk-in added to queue", queueEntry }, 201);
  } catch (error) {
    console.error("Error adding walk-in:", error);
    return corsResponse({ error: error.message || "Failed to add walk-in" }, 400);
  }
}
