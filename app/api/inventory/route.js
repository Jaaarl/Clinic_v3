import { inventoryService } from "@/lib/services/inventoryService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";
import { validateRequired } from "@/lib/utils/validation";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET() {
  try {
    const inventoryItems = await inventoryService.getInventoryItems();
    return corsResponse({ inventoryItems });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return corsResponse({ error: "Failed to fetch inventory" }, 500);
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { valid, missing } = validateRequired(data, ["name", "quantityInStock"]);

    if (!valid) {
      return corsResponse(
        { error: `Missing required fields: ${missing.join(", ")}` },
        400
      );
    }

    const newItem = await inventoryService.addInventoryItem(data, request);
    return corsResponse({ message: "Item added successfully", newItem }, 201);
  } catch (error) {
    console.error("Error adding inventory item:", error);
    return corsResponse({ error: error.message || "Failed to add item" }, 500);
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");
    const data = await request.json();

    if (!id) {
      return corsResponse({ error: "ID is required" }, 400);
    }

    const updatedItem = await inventoryService.updateInventoryItem(
      id,
      data,
      data.reason || "Manual update",
      request
    );

    return corsResponse({ message: "Inventory updated", item: updatedItem });
  } catch (error) {
    console.error("Error updating inventory:", error);
    return corsResponse({ error: error.message || "Failed to update item" }, 500);
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");

    if (!id) {
      return corsResponse({ error: "ID is required" }, 400);
    }

    await inventoryService.deleteInventoryItem(id, request);
    return corsResponse({ message: "Inventory deleted" });
  } catch (error) {
    console.error("Error deleting inventory:", error);
    return corsResponse(
      { error: error.message || "Failed to delete item" },
      error.message === "Item not found" ? 404 : 500
    );
  }
}

export async function PATCH(request) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");
    const quantityToDeduct = parseInt(searchParams.get("quantityToDeduct"), 10);

    if (!id || !quantityToDeduct) {
      return corsResponse(
        { error: "ID and quantityToDeduct parameters are required" },
        400
      );
    }

    const updatedItem = await inventoryService.deductStock(
      id,
      quantityToDeduct,
      request
    );

    return corsResponse({ message: "Inventory updated", item: updatedItem });
  } catch (error) {
    console.error("Error deducting stock:", error);
    return corsResponse(
      { error: error.message || "Failed to deduct stock" },
      error.message === "Item not found" ? 404 : 500
    );
  }
}
