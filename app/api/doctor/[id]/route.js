import { doctorService } from "@/lib/services/doctorService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";

export async function OPTIONS() { return handleOptions(); }

export async function GET(request, { params }) {
  try {
    const doctor = await doctorService.getDoctorById(params.id);
    if (!doctor) {
      return corsResponse({ error: "Doctor not found" }, 404);
    }
    return corsResponse({ doctor });
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return corsResponse({ error: "Failed to fetch doctor" }, 500);
  }
}

export async function PATCH(request, { params }) {
  try {
    const data = await request.json();
    const doctor = await doctorService.updateDoctor(params.id, data);
    return corsResponse({ message: "Doctor updated", doctor });
  } catch (error) {
    console.error("Error updating doctor:", error);
    return corsResponse({ error: error.message || "Failed to update doctor" }, 400);
  }
}

export async function DELETE(request, { params }) {
  try {
    await doctorService.deleteDoctor(params.id);
    return corsResponse({ message: "Doctor deleted" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return corsResponse({ error: error.message || "Failed to delete doctor" }, 400);
  }
}
