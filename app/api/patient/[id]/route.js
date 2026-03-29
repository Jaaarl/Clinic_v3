import { patientService } from "@/lib/services/patientService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";

export async function OPTIONS() { return handleOptions(); }

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const patient = await patientService.getPatientById(id);
    if (!patient) return corsResponse({ error: "Patient not found" }, 404);
    return corsResponse({ patient });
  } catch (error) {
    console.error("Error fetching patient:", error);
    return corsResponse({ error: "Failed to fetch patient" }, 500);
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    const patient = await patientService.updatePatient(id, data);
    if (!patient) return corsResponse({ error: "Patient not found" }, 404);
    return corsResponse({ message: "Patient updated", patient });
  } catch (error) {
    console.error("Error updating patient:", error);
    return corsResponse({ error: error.message || "Failed to update patient" }, 400);
  }
}
