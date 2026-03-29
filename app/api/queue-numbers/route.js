import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/libs/mongodb";

const QueueNumSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const QueueNum =
  mongoose.models.QueueNum || mongoose.model("QueueNum", QueueNumSchema);

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let query = {};

    // Build date filter query
    if (startDate || endDate) {
      query.createdAt = {};

      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endOfDay;
      }
    }

    // Fetch queue numbers with optional date filtering
    const queueNumbers = await QueueNum.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(queueNumbers);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch queue numbers" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    // Create new queue number
    const queueNumber = new QueueNum(body);
    await queueNumber.save();

    return NextResponse.json(queueNumber, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to create queue number" },
      { status: 500 }
    );
  }
}

// Optional: GET with aggregation for compiled data
export async function getCompiledData() {
  try {
    await connectDB();

    const compiled = await QueueNum.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
          items: { $push: "$$ROOT" },
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]);

    return compiled;
  } catch (error) {
    console.error("Compilation Error:", error);
    throw new Error("Failed to compile queue data");
  }
}
