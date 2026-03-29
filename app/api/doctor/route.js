import { doctorService } from "@/lib/services/doctorService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";
import { validateRequired } from "@/lib/utils/validation";

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
    const { valid, missing } = validateRequired(data, ["name", "lic"]);
    if (!valid) return corsResponse({ error: `Missing required fields: ${missing.join(", ")}` }, 400);
    const doctor = await doctorService.createDoctor(data);
    return corsResponse({ message: "Doctor Created", doctor }, 201);
  } catch (error) {
    console.error("Error creating doctor:", error);
    return corsResponse({ error: "Failed to create doctor" }, 500);
  }
}
