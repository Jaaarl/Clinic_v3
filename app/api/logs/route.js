import { NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import Log from "@/models/log";

export async function POST(request) {
  try {
    await connectDB();
    const { quantityDeducted, timestamp, name, exp } = await request.json();
    const newLogEntry = new Log({
      exp: timestamp,
      name,
      quantityDeducted,
      timestamp: timestamp || new Date(),
    });

    const savedLogEntry = await newLogEntry.save();

    return NextResponse.json(savedLogEntry, { status: 201 });
  } catch (error) {
    console.error("Error creating log entry:", error);
    return NextResponse.json(
      { message: "Failed to create log entry" },
      { status: 500 }
    );
  }
}
