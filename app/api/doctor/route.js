import { doctorService } from "@/lib/services/doctorService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";

export async function OPTIONS() { return handleOptions(); }

export async function GET() {
  try {
    const doctors = await doctorService.getDoctors();
    return corsResponse({ doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return corsResponse({ error: "Failed to fetch doctors" }, 500);
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const doctor = await doctorService.createDoctor(data);
    return corsResponse({ message: "Doctor Created", doctor }, 201);
  } catch (error) {
    console.error("Error creating doctor:", error);
    return corsResponse({ error: error.message || "Failed to create doctor" }, 400);
  }
}
