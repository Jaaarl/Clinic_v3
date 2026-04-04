import { appointmentService } from "@/lib/services/appointmentService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";

export async function OPTIONS() { return handleOptions(); }

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;
    const filters = {
      date: searchParams.get("date"),
      doctorId: searchParams.get("doctorId"),
      status: searchParams.get("status"),
      page: parseInt(searchParams.get("page")) || 1,
      limit: parseInt(searchParams.get("limit")) || 50,
    };

    const result = await appointmentService.getAppointments(filters);
    return corsResponse(result);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return corsResponse({ error: error.message || "Failed to fetch appointments" }, 500);
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const appointment = await appointmentService.createAppointment(data);
    return corsResponse({ message: "Appointment created", appointment }, 201);
  } catch (error) {
    console.error("Error creating appointment:", error);
    return corsResponse({ error: error.message || "Failed to create appointment" }, 400);
  }
}
