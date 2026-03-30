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

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    if (!id) return corsResponse({ error: "ID is required" }, 400);
    await inventoryService.deleteInventoryItem(id, request);
    return corsResponse({ message: "Inventory deleted" });
  } catch (error) {
    console.error("Error deleting inventory:", error);
    return corsResponse({ error: error.message || "Failed to delete item" },
      error.message === "Item not found" ? 404 : 400);
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    const quantityToDeduct = parseInt(data.quantityToDeduct, 10);
    if (!id || !quantityToDeduct) return corsResponse({ error: "ID and quantityToDeduct are required" }, 400);
    const updatedItem = await inventoryService.deductStock(id, quantityToDeduct, request);
    return corsResponse({ message: "Inventory updated", item: updatedItem });
  } catch (error) {
    console.error("Error deducting stock:", error);
    return corsResponse({ error: error.message || "Failed to deduct stock" },
      error.message === "Item not found" ? 404 : 400);
  }
}
