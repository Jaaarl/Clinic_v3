import { NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import InventoryLog from "@/models/inventoryLog";
import mongoose from "mongoose";

// GET /api/inventory-logs/sales - Get total sales from stock deductions
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const inventoryId = searchParams.get("inventoryId");
    const itemName = searchParams.get("itemName");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const expirationStartDate = searchParams.get("expirationStartDate");
    const expirationEndDate = searchParams.get("expirationEndDate");
    const includeExpired = searchParams.get("includeExpired"); // "true" or "false"

    // Build match filter
    let matchFilter = {
      action: "STOCK_DEDUCTION",
    };

    // Filter by specific inventory item
    if (inventoryId) {
      matchFilter.inventoryId = new mongoose.Types.ObjectId(inventoryId);
    }

    // Filter by item name
    if (itemName) {
      matchFilter.$or = [
        { "newData.name": { $regex: itemName, $options: "i" } },
        { "previousData.name": { $regex: itemName, $options: "i" } },
      ];
    }

    // Filter by transaction date range
    if (startDate || endDate) {
      matchFilter.timestamp = {};
      if (startDate) {
        matchFilter.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        matchFilter.timestamp.$lte = new Date(endDate);
      }
    }

    // Filter by expiration date range
    if (expirationStartDate || expirationEndDate) {
      matchFilter["previousData.expirationDate"] = {};
      if (expirationStartDate) {
        matchFilter["previousData.expirationDate"].$gte = new Date(
          expirationStartDate
        );
      }
      if (expirationEndDate) {
        matchFilter["previousData.expirationDate"].$lte = new Date(
          expirationEndDate
        );
      }
    }

    // Filter expired items (if includeExpired is explicitly set to "false")
    if (includeExpired === "false") {
      matchFilter["previousData.expirationDate"] = {
        ...matchFilter["previousData.expirationDate"],
        $gte: new Date(), // Only include items not yet expired
      };
    }

    // Aggregate total sales
    const salesData = await InventoryLog.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          totalQuantitySold: {
            $sum: { $abs: "$quantityChanged" },
          },
          totalRevenue: {
            $sum: {
              $multiply: [
                { $abs: "$quantityChanged" },
                { $ifNull: ["$previousData.price", 0] },
              ],
            },
          },
          totalTransactions: { $sum: 1 },
        },
      },
    ]);

    // Get sales breakdown by item (with expiration date info)
    const salesByItem = await InventoryLog.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: "$inventoryId",
          itemName: { $first: "$previousData.name" },
          expirationDate: { $first: "$previousData.expirationDate" },
          totalQuantitySold: {
            $sum: { $abs: "$quantityChanged" },
          },
          totalRevenue: {
            $sum: {
              $multiply: [
                { $abs: "$quantityChanged" },
                { $ifNull: ["$previousData.price", 0] },
              ],
            },
          },
          transactions: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    // Get expired items sales breakdown
    const expiredItemsSales = await InventoryLog.aggregate([
      {
        $match: {
          ...matchFilter,
          "previousData.expirationDate": { $lt: new Date() },
        },
      },
      {
        $group: {
          _id: null,
          totalQuantitySold: {
            $sum: { $abs: "$quantityChanged" },
          },
          totalRevenue: {
            $sum: {
              $multiply: [
                { $abs: "$quantityChanged" },
                { $ifNull: ["$previousData.price", 0] },
              ],
            },
          },
          totalTransactions: { $sum: 1 },
        },
      },
    ]);

    const result =
      salesData.length > 0
        ? salesData[0]
        : {
            totalQuantitySold: 0,
            totalRevenue: 0,
            totalTransactions: 0,
          };

    const expiredResult =
      expiredItemsSales.length > 0
        ? expiredItemsSales[0]
        : {
            totalQuantitySold: 0,
            totalRevenue: 0,
            totalTransactions: 0,
          };

    return NextResponse.json(
      {
        summary: {
          totalQuantitySold: result.totalQuantitySold,
          totalRevenue: result.totalRevenue,
          totalTransactions: result.totalTransactions,
          averageTransactionValue:
            result.totalTransactions > 0
              ? result.totalRevenue / result.totalTransactions
              : 0,
        },
        expiredItemsSummary: {
          totalQuantitySold: expiredResult.totalQuantitySold,
          totalRevenue: expiredResult.totalRevenue,
          totalTransactions: expiredResult.totalTransactions,
        },
        salesByItem,
        filters: {
          inventoryId,
          itemName,
          startDate,
          endDate,
          expirationStartDate,
          expirationEndDate,
          includeExpired,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error calculating total sales:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
