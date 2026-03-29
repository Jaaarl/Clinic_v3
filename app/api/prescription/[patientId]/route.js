import { prescriptionService } from "@/lib/services/prescriptionService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request, { params }) {
  try {
    const { patientId } = params;
    const prescriptions = await prescriptionService.getPrescriptionsByPatientId(patientId);
    return corsResponse({ prescriptions });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return corsResponse({ error: "Failed to fetch prescriptions" }, 500);
  }
}
