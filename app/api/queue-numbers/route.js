import { queueService } from "@/lib/services/queueService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";

export async function OPTIONS() { return handleOptions(); }

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;
    const queueNumbers = await queueService.getQueueNumbers({
      startDate: searchParams.get("startDate"),
      endDate: searchParams.get("endDate"),
    });
    return corsResponse(queueNumbers);
  } catch (error) {
    console.error("Error fetching queue numbers:", error);
    return corsResponse({ error: "Failed to fetch queue numbers" }, 500);
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const queueNum = await queueService.createQueueNumber(data);
    return corsResponse(queueNum, 201);
  } catch (error) {
    console.error("Error creating queue number:", error);
    return corsResponse({ error: "Failed to create queue number" }, 500);
  }
}
