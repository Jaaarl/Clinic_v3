import { doctorService } from "@/lib/services/doctorService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const doctor = await doctorService.getDoctorById(id);

    if (!doctor) {
      return corsResponse({ error: "Doctor not found" }, 404);
    }

    return corsResponse({ doctor });
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return corsResponse({ error: "Failed to fetch doctor" }, 500);
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    const doctor = await doctorService.updateDoctor(id, data);

    if (!doctor) {
      return corsResponse({ error: "Doctor not found" }, 404);
    }

    return corsResponse({ message: "Doctor updated", doctor });
  } catch (error) {
    console.error("Error updating doctor:", error);
    return corsResponse({ error: "Failed to update doctor" }, 500);
  }
}
