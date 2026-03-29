import Inventory from "@/models/inventory";
import InventoryLog from "@/models/inventoryLog";
import connectDB from "@/libs/mongodb";
import { getRequestMetadata } from "@/lib/utils/validation";

/**
 * Inventory Service - All inventory-related business logic
 */
export const inventoryService = {
  /**
   * Create an inventory log entry
   * @param {object} params
   */
  async createLog(inventoryId, action, previousData, newData, quantityChanged, reason, request) {
    try {
      const { ipAddress, userAgent } = getRequestMetadata(request);
      await connectDB();
      
      const logData = {
        inventoryId,
        action,
        quantityChanged,
        reason,
        timestamp: new Date(),
        previousData,
        newData,
        ipAddress,
        userAgent,
      };

      return InventoryLog.create(logData);
    } catch (error) {
      console.error("Error creating inventory log:", error);
      // Don't throw - logging failure shouldn't break main operations
    }
  },

  /**
   * Get all inventory items
   * @returns {Promise<Inventory[]>}
   */
  async getInventoryItems() {
    await connectDB();
    return Inventory.find({});
  },

  /**
   * Get a single inventory item by ID
   * @param {string} id - Inventory ID
   * @returns {Promise<Inventory|null>}
   */
  async getInventoryById(id) {
    await connectDB();
    return Inventory.findOne({ _id: id });
  },

  /**
   * Add a new inventory item
   * @param {object} data - Item data
   * @param {Request} request - Optional request for logging
   * @returns {Promise<Inventory>}
   */
  async addInventoryItem({ name, quantityInStock, expirationDate, price }, request = null) {
    await connectDB();
    const newItem = new Inventory({ name, quantityInStock, expirationDate, price });
    await newItem.save();

    // Log creation
    await this.createLog(
      newItem._id,
      "CREATE",
      null,
      { name, quantityInStock, expirationDate, price },
      quantityInStock,
      "New inventory item created",
      request
    );

    return newItem;
  },

  /**
   * Update an inventory item
   * @param {string} id - Item ID
   * @param {object} data - Update data
   * @param {string} reason - Reason for update
   * @param {Request} request - Optional request for logging
   * @returns {Promise<Inventory>}
   */
  async updateInventoryItem(id, { name, quantityInStock, expirationDate, price }, reason = "Manual update", request = null) {
    await connectDB();
    const currentItem = await Inventory.findById(id);
    
    if (!currentItem) {
      throw new Error("Inventory not found");
    }

    const quantityChanged = quantityInStock - currentItem.quantityInStock;

    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      { name, quantityInStock, expirationDate, price },
      { new: true }
    );

    // Log update
    await this.createLog(
      id,
      "UPDATE",
      {
        name: currentItem.name,
        quantityInStock: currentItem.quantityInStock,
        expirationDate: currentItem.expirationDate,
        price: currentItem.price,
      },
      { name, quantityInStock, expirationDate, price },
      quantityChanged,
      reason,
      request
    );

    return updatedItem;
  },

  /**
   * Delete an inventory item
   * @param {string} id - Item ID
   * @param {Request} request - Optional request for logging
   * @returns {Promise<void>}
   */
  async deleteInventoryItem(id, request = null) {
    await connectDB();
    const item = await Inventory.findById(id);
    
    if (!item) {
      throw new Error("Item not found");
    }

    await Inventory.findByIdAndDelete(id);

    // Log deletion
    await this.createLog(
      id,
      "DELETE",
      {
        name: item.name,
        quantityInStock: item.quantityInStock,
        expirationDate: item.expirationDate,
        price: item.price,
      },
      null,
      -item.quantityInStock,
      "Inventory item deleted",
      request
    );
  },

  /**
   * Deduct stock from an inventory item
   * @param {string} id - Item ID
   * @param {number} quantityToDeduct - Quantity to deduct
   * @param {Request} request - Optional request for logging
   * @returns {Promise<Inventory>}
   */
  async deductStock(id, quantityToDeduct, request = null) {
    await connectDB();
    const inventory = await Inventory.findOne({ _id: id });

    if (!inventory) {
      throw new Error("Item not found");
    }

    if (inventory.quantityInStock < quantityToDeduct) {
      throw new Error("Not enough stock to deduct");
    }

    const previousData = {
      name: inventory.name,
      quantityInStock: inventory.quantityInStock,
      expirationDate: inventory.expirationDate,
      price: inventory.price,
    };

    inventory.quantityInStock -= quantityToDeduct;
    await inventory.save();

    // Log deduction
    await this.createLog(
      inventory._id,
      "STOCK_DEDUCTION",
      previousData,
      {
        name: inventory.name,
        quantityInStock: inventory.quantityInStock,
        expirationDate: inventory.expirationDate,
        price: inventory.price,
      },
      -quantityToDeduct,
      `Stock deducted: ${quantityToDeduct} units`,
      request
    );

    return inventory;
  },
};
