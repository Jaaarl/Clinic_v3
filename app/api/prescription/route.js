import { NextResponse } from "next/server";
import { patientService } from "@/lib/services/patientService";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");
    const visitDate = searchParams.get("visitDate");

    if (!patientId || !visitDate) {
      return NextResponse.json(
        { error: "patientId and visitDate are required" },
        { status: 400 }
      );
    }

    const patient = await patientService.getPatientById(patientId);

    if (!patient) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      );
    }

    const visit = patient.visit_history?.find(
      (v) => v.visit_date === visitDate
    );

    if (!visit) {
      return NextResponse.json(
        { error: "Visit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      prescription: visit.form?.reseta || "",
      labReq: visit.form?.labReq || "",
    });
  } catch (error) {
    console.error("Error fetching prescription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
