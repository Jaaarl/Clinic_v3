import { logService } from "@/lib/services/logService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";
import { validateRequired } from "@/lib/utils/validation";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(request) {
  try {
    const data = await request.json();

    const log = await logService.createLog(data);
    return corsResponse(log, 201);
  } catch (error) {
    console.error("Error creating log entry:", error);
    return corsResponse({ error: "Failed to create log entry" }, 500);
  }
}
