import Inventory from "@/models/inventory";
import InventoryLog from "@/models/inventoryLog";
import connectDB from "@/lib/mongodb";
import { getRequestMetadata, canDeductStock } from "@/lib/utils/validation";

export const inventoryService = {
  async createLog(inventoryId, action, previousData, newData, quantityChanged, reason, request) {
    try {
      const { ipAddress, userAgent } = getRequestMetadata(request);
      await connectDB();
      return InventoryLog.create({
        inventoryId, action, quantityChanged, reason, timestamp: new Date(),
        previousData, newData, ipAddress, userAgent,
      });
    } catch (error) {
      console.error("Error creating inventory log:", error);
    }
  },

  async getInventoryItems() {
    await connectDB();
    return Inventory.find({});
  },

  async getInventoryById(id) {
    await connectDB();
    return Inventory.findOne({ _id: id });
  },

  async addInventoryItem({ name, quantityInStock, expirationDate, price }, request = null) {
    // Validate required fields
    if (!name || quantityInStock === undefined || quantityInStock === null) {
      throw new Error("name and quantityInStock are required");
    }
    if (quantityInStock < 0) {
      throw new Error("quantityInStock cannot be negative");
    }

    await connectDB();
    const newItem = new Inventory({ name, quantityInStock, expirationDate, price });
    await newItem.save();
    await this.createLog(newItem._id, "CREATE", null,
      { name, quantityInStock, expirationDate, price }, quantityInStock,
      "New inventory item created", request);
    return newItem;
  },

  async updateInventoryItem(id, { name, quantityInStock, expirationDate, price }, reason = "Manual update", request = null) {
    // Validate required fields
    if (!name || quantityInStock === undefined || quantityInStock === null) {
      throw new Error("name and quantityInStock are required");
    }
    if (quantityInStock < 0) {
      throw new Error("quantityInStock cannot be negative");
    }

    await connectDB();
    const currentItem = await Inventory.findById(id);
    if (!currentItem) throw new Error("Inventory not found");
    const quantityChanged = quantityInStock - currentItem.quantityInStock;
    const updatedItem = await Inventory.findByIdAndUpdate(id,
      { name, quantityInStock, expirationDate, price }, { new: true });
    await this.createLog(id, "UPDATE",
      { name: currentItem.name, quantityInStock: currentItem.quantityInStock, expirationDate: currentItem.expirationDate, price: currentItem.price },
      { name, quantityInStock, expirationDate, price }, quantityChanged, reason, request);
    return updatedItem;
  },

  async deleteInventoryItem(id, request = null) {
    await connectDB();
    const item = await Inventory.findById(id);
    if (!item) throw new Error("Item not found");
    await Inventory.findByIdAndDelete(id);
    await this.createLog(id, "DELETE",
      { name: item.name, quantityInStock: item.quantityInStock, expirationDate: item.expirationDate, price: item.price },
      null, -item.quantityInStock, "Inventory item deleted", request);
  },

  async deductStock(id, quantityToDeduct, request = null) {
    if (quantityToDeduct <= 0) {
      throw new Error("quantityToDeduct must be greater than 0");
    }

    await connectDB();
    const inventory = await Inventory.findOne({ _id: id });
    if (!inventory) throw new Error("Item not found");
    
    if (!canDeductStock(inventory.quantityInStock, quantityToDeduct)) {
      throw new Error("Not enough stock to deduct. Stock would go negative.");
    }

    const previousData = { name: inventory.name, quantityInStock: inventory.quantityInStock, expirationDate: inventory.expirationDate, price: inventory.price };
    inventory.quantityInStock -= quantityToDeduct;
    await inventory.save();
    await this.createLog(inventory._id, "STOCK_DEDUCTION", previousData,
      { name: inventory.name, quantityInStock: inventory.quantityInStock, expirationDate: inventory.expirationDate, price: inventory.price },
      -quantityToDeduct, `Stock deducted: ${quantityToDeduct} units`, request);
    return inventory;
  },
};
