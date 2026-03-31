import InventoryLog from "@/models/inventoryLog";
import Log from "@/models/log";
import connectDB from "@/lib/mongodb";

export const logService = {
  async getInventoryLogs({ inventoryId = null, itemName = null, action = null, limit = 50, page = 1 } = {}) {
    await connectDB();
    let filter = {};
    if (inventoryId) filter.inventoryId = inventoryId;
    if (itemName) {
      filter.$or = [
        { "newData.name": { $regex: itemName, $options: "i" } },
        { "previousData.name": { $regex: itemName, $options: "i" } },
      ];
    }
    if (action) filter.action = action;
    const skip = (page - 1) * limit;
    const [logs, totalCount] = await Promise.all([
      InventoryLog.find(filter).populate("inventoryId", "name").sort({ timestamp: -1 }).limit(limit).skip(skip).lean(),
      InventoryLog.countDocuments(filter),
    ]);
    return {
      logs,
      pagination: { currentPage: page, totalPages: Math.ceil(totalCount / limit), totalCount, hasMore: skip + logs.length < totalCount },
    };
  },

  async getSalesData({ inventoryId = null, itemName = null, startDate = null, endDate = null,
    expirationStartDate = null, expirationEndDate = null, includeExpired = true } = {}) {
    await connectDB();
    const mongoose = await import("mongoose");
    let matchFilter = { action: "STOCK_DEDUCTION" };
    if (inventoryId) matchFilter.inventoryId = new mongoose.Types.ObjectId(inventoryId);
    if (itemName) {
      matchFilter.$or = [
        { "newData.name": { $regex: itemName, $options: "i" } },
        { "previousData.name": { $regex: itemName, $options: "i" } },
      ];
    }
    if (startDate || endDate) {
      matchFilter.timestamp = {};
      if (startDate) matchFilter.timestamp.$gte = new Date(startDate);
      if (endDate) matchFilter.timestamp.$lte = new Date(endDate);
    }
    if (expirationStartDate || expirationEndDate) {
      matchFilter["previousData.expirationDate"] = {};
      if (expirationStartDate) matchFilter["previousData.expirationDate"].$gte = new Date(expirationStartDate);
      if (expirationEndDate) matchFilter["previousData.expirationDate"].$lte = new Date(expirationEndDate);
    }
    if (!includeExpired) {
      matchFilter["previousData.expirationDate"] = { ...matchFilter["previousData.expirationDate"], $gte: new Date() };
    }

    const [salesData, salesByItem, expiredItemsSales] = await Promise.all([
      InventoryLog.aggregate([
        { $match: matchFilter },
        { $group: { _id: null, totalQuantitySold: { $sum: { $abs: "$quantityChanged" } },
          totalRevenue: { $sum: { $multiply: [{ $abs: "$quantityChanged" }, { $ifNull: ["$previousData.price", 0] }] } },
          totalTransactions: { $sum: 1 } } },
      ]),
      InventoryLog.aggregate([
        { $match: matchFilter },
        { $group: { _id: "$inventoryId", itemName: { $first: "$previousData.name" },
          expirationDate: { $first: "$previousData.expirationDate" },
          totalQuantitySold: { $sum: { $abs: "$quantityChanged" } },
          totalRevenue: { $sum: { $multiply: [{ $abs: "$quantityChanged" }, { $ifNull: ["$previousData.price", 0] }] } },
          transactions: { $sum: 1 } } },
        { $sort: { totalRevenue: -1 } },
      ]),
      InventoryLog.aggregate([
        { $match: { ...matchFilter, "previousData.expirationDate": { $lt: new Date() } } },
        { $group: { _id: null, totalQuantitySold: { $sum: { $abs: "$quantityChanged" } },
          totalRevenue: { $sum: { $multiply: [{ $abs: "$quantityChanged" }, { $ifNull: ["$previousData.price", 0] }] } },
          totalTransactions: { $sum: 1 } } },
      ]),
    ]);

    const result = salesData[0] || { totalQuantitySold: 0, totalRevenue: 0, totalTransactions: 0 };
    const expiredResult = expiredItemsSales[0] || { totalQuantitySold: 0, totalRevenue: 0, totalTransactions: 0 };
    return {
      summary: {
        totalQuantitySold: result.totalQuantitySold, totalRevenue: result.totalRevenue,
        totalTransactions: result.totalTransactions,
        averageTransactionValue: result.totalTransactions > 0 ? result.totalRevenue / result.totalTransactions : 0,
      },
      expiredItemsSummary: { totalQuantitySold: expiredResult.totalQuantitySold, totalRevenue: expiredResult.totalRevenue, totalTransactions: expiredResult.totalTransactions },
      salesByItem,
      filters: { inventoryId, itemName, startDate, endDate, expirationStartDate, expirationEndDate, includeExpired },
    };
  },

  async createLog({ quantityDeducted, timestamp, name, exp }) {
    await connectDB();
    return Log.create({ exp: timestamp, name, quantityDeducted, timestamp: timestamp || new Date() });
  },
};
