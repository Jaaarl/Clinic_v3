import mongoose from "mongoose";

const inventoryLogSchema = new mongoose.Schema(
  {
    inventoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: true,
    },
    action: {
      type: String,
      enum: ["CREATE", "UPDATE", "DELETE", "STOCK_DEDUCTION"],
      required: true,
    },
    previousData: {
      name: String,
      quantityInStock: Number,
      expirationDate: Date,
      price: Number,
    },
    newData: {
      name: String,
      quantityInStock: Number,
      expirationDate: Date,
      price: Number,
    },
    quantityChanged: {
      type: Number,
      default: 0,
    },
    reason: {
      type: String,
      default: "",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    userAgent: String,
    ipAddress: String,
  },
  {
    timestamps: true,
  }
);

// Add index for better query performance
inventoryLogSchema.index({ inventoryId: 1, timestamp: -1 });
inventoryLogSchema.index({ action: 1, timestamp: -1 });

const InventoryLog =
  mongoose.models.InventoryLog ||
  mongoose.model("InventoryLog", inventoryLogSchema);

export default InventoryLog;
