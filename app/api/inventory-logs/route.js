import { logService } from "@/lib/services/logService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";
import { parseIntOrDefault } from "@/lib/utils/validation";

export async function OPTIONS() { return handleOptions(); }

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;
    const result = await logService.getInventoryLogs({
      inventoryId: searchParams.get("inventoryId"),
      itemName: searchParams.get("itemName"),
      action: searchParams.get("action"),
      limit: parseIntOrDefault(searchParams.get("limit"), 50),
      page: parseIntOrDefault(searchParams.get("page"), 1),
    });
    return corsResponse(result);
  } catch (error) {
    console.error("Error fetching inventory logs:", error);
    return corsResponse({ error: error.message || "Failed to fetch logs" }, 500);
  }
}
