import { logService } from "@/lib/services/logService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";

export async function OPTIONS() { return handleOptions(); }

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;
    const result = await logService.getSalesData({
      inventoryId: searchParams.get("inventoryId"),
      itemName: searchParams.get("itemName"),
      startDate: searchParams.get("startDate"),
      endDate: searchParams.get("endDate"),
      expirationStartDate: searchParams.get("expirationStartDate"),
      expirationEndDate: searchParams.get("expirationEndDate"),
      includeExpired: searchParams.get("includeExpired") !== "false",
    });
    return corsResponse(result);
  } catch (error) {
    console.error("Error calculating sales:", error);
    return corsResponse({ error: error.message || "Failed to calculate sales" }, 500);
  }
}
