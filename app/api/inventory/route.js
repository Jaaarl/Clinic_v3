import { inventoryService } from "@/lib/services/inventoryService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";

export async function OPTIONS() { return handleOptions(); }

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    
    const result = await inventoryService.getInventoryItems(page, limit);
    return corsResponse(result);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return corsResponse({ error: "Failed to fetch inventory" }, 500);
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const newItem = await inventoryService.addInventoryItem(data, request);
    return corsResponse({ message: "Item added successfully", newItem }, 201);
  } catch (error) {
    console.error("Error adding inventory item:", error);
    return corsResponse({ error: error.message || "Failed to add item" }, 400);
  }
}