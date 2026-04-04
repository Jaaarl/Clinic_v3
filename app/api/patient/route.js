import { patientService } from "@/lib/services/patientService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";

export async function OPTIONS() { return handleOptions(); }

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;
    const searchQuery = searchParams.get("search");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    
    const result = await patientService.getPatients(searchQuery, page, limit);
    return corsResponse(result);
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
