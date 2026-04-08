import { appointmentService } from "@/lib/services/appointmentService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";

export async function OPTIONS() { return handleOptions(); }

export async function GET(request, { params }) {
  try {
    const appointment = await appointmentService.getAppointmentById(params.id);
    if (!appointment) {
      return corsResponse({ error: "Appointment not found" }, 404);
    }
    return corsResponse({ appointment });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return corsResponse({ error: "Failed to fetch appointment" }, 500);
  }
}

export async function PATCH(request, { params }) {
  try {
    const data = await request.json();
    const appointment = await appointmentService.updateAppointment(params.id, data);
    return corsResponse({ message: "Appointment updated", appointment });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return corsResponse({ error: error.message || "Failed to update appointment" }, 400);
  }
}

export async function DELETE(request, { params }) {
  try {
    await appointmentService.cancelAppointment(params.id);
    return corsResponse({ message: "Appointment cancelled" });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return corsResponse({ error: error.message || "Failed to cancel appointment" }, 400);
  }
}
