import { patientService } from "@/lib/services/patientService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";

export async function OPTIONS() { return handleOptions(); }

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;
    const searchQuery = searchParams.get("search");
    const patients = await patientService.getPatients(searchQuery);
    return corsResponse({ patients });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return corsResponse({ error: "Failed to fetch patients" }, 500);
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const patient = await patientService.createPatient(data);
    return corsResponse({ message: "Patient Created", patient }, 201);
  } catch (error) {
    console.error("Error creating patient:", error);
    return corsResponse({ error: error.message || "Failed to create patient" }, 400);
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");
    if (!id) return corsResponse({ error: "ID is required" }, 400);
    await patientService.deletePatient(id);
    return corsResponse({ message: "Patient deleted" });
  } catch (error) {
    console.error("Error deleting patient:", error);
    return corsResponse({ error: "Failed to delete patient" }, 500);
  }
}
