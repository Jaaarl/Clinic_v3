import { NextResponse } from "next/server";
import { patientService } from "@/lib/services/patientService";
import { doctorService } from "@/lib/services/doctorService";
import { generateResetaText } from "@/lib/utils/prescriptionUtils";

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

    // Get doctor info
    const doctors = await doctorService.getDoctors();
    const doctor = doctors[0] || {};

    // Build patient address string
    const addr = patient.contact?.address || {};
    const addressStr = [addr.street, addr.city, addr.province].filter(Boolean).join(", ") || "";

    // Build prescription text: use reseta, or generate from structured prescriptions
    let prescription = visit.form?.reseta || "";
    if (!prescription && visit.form?.prescriptions?.length) {
      prescription = generateResetaText(visit.form.prescriptions);
    }

    return NextResponse.json({
      patient: {
        name: patient.name || "",
        birthday: patient.birthday || "",
        gender: patient.gender || "",
        address: addressStr,
      },
      visit: {
        date: visit.visit_date || "",
      },
      prescription,
      labReq: visit.form?.labReq || "",
      assessment: visit.soap?.assessment || "",
      plan: visit.soap?.plan || "",
      doctor: {
        name: doctor.name || "",
        lic: doctor.lic || "",
        ptr: doctor.ptr || "",
        s2: doctor.s2 || "",
      },
    });
  } catch (error) {
    console.error("Error fetching print data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
