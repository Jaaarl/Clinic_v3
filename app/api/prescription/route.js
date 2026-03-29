import { prescriptionService } from "@/lib/services/prescriptionService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";
import { validateRequired } from "@/lib/utils/validation";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;
    const prescriptionId = searchParams.get("id");
    const patientId = searchParams.get("patientId");

    if (prescriptionId) {
      const prescription = await prescriptionService.getPrescriptionById(prescriptionId);
      if (!prescription) {
        return corsResponse({ error: "Prescription not found" }, 404);
      }
      return corsResponse({ prescription });
    }

    if (patientId) {
      const prescriptions = await prescriptionService.getPrescriptionsByPatientId(patientId);
      return corsResponse({ prescriptions });
    }

    return corsResponse({ error: "patientId or id required" }, 400);
  } catch (error) {
    console.error("Error fetching prescription:", error);
    return corsResponse({ error: "Failed to fetch prescription" }, 500);
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { valid, missing } = validateRequired(data, [
      "patientId",
      "doctorName",
      "doctorLicense",
      "medicines",
    ]);

    if (!valid) {
      return corsResponse(
        { error: `Missing required fields: ${missing.join(", ")}` },
        400
      );
    }

    const prescription = await prescriptionService.createPrescription(data);
    return corsResponse({ message: "Prescription created", prescription }, 201);
  } catch (error) {
    console.error("Error creating prescription:", error);
    return corsResponse({ error: "Failed to create prescription" }, 500);
  }
}
