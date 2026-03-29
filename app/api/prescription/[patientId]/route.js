import connectDB from "@/libs/mongodb";
import Prescription from "@/models/prescription";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { patientId } = params;
    await connectDB();

    const prescriptions = await Prescription.find({ patientId })
      .sort({ date: -1 })
      .limit(10);

    return NextResponse.json({ prescriptions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return NextResponse.json({ error: "Failed to fetch prescriptions" }, { status: 500 });
  }
}
