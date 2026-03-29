import { inventoryService } from "@/lib/services/inventoryService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";

export async function OPTIONS() { return handleOptions(); }

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const inventory = await inventoryService.getInventoryById(id);
    if (!inventory) return corsResponse({ error: "Inventory not found" }, 404);
    return corsResponse({ inventory });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return corsResponse({ error: "Failed to fetch inventory" }, 500);
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    const updatedItem = await inventoryService.updateInventoryItem(id, data, data.reason || "Manual update", request);
    if (!updatedItem) return corsResponse({ error: "Inventory not found" }, 404);
    return corsResponse({ message: "Inventory updated", item: updatedItem });
  } catch (error) {
    console.error("Error updating inventory:", error);
    return corsResponse({ error: error.message || "Failed to update inventory" },
      error.message === "Inventory not found" ? 404 : 500);
  }
}
