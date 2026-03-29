import connectDB from "@/libs/mongodb";
import Prescription from "@/models/prescription";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { patientId, visitId, doctorName, doctorLicense, doctorPtr, doctorS2, medicines, notes } = await request.json();

    if (!patientId || !doctorName || !doctorLicense || !medicines?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    const prescription = await Prescription.create({
      patientId,
      visitId,
      doctorName,
      doctorLicense,
      doctorPtr,
      doctorS2,
      medicines,
      notes
    });

    return NextResponse.json({ message: "Prescription created", prescription }, { status: 201 });
  } catch (error) {
    console.error("Error creating prescription:", error);
    return NextResponse.json({ error: "Failed to create prescription" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const patientId = searchParams.get("patientId");
    const prescriptionId = searchParams.get("id");

    if (prescriptionId) {
      const prescription = await Prescription.findById(prescriptionId);
      if (!prescription) {
        return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
      }
      return NextResponse.json({ prescription }, { status: 200 });
    }

    if (patientId) {
      const prescriptions = await Prescription.find({ patientId }).sort({ date: -1 });
      return NextResponse.json({ prescriptions }, { status: 200 });
    }

    return NextResponse.json({ error: "patientId or id required" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching prescription:", error);
    return NextResponse.json({ error: "Failed to fetch prescription" }, { status: 500 });
  }
}
