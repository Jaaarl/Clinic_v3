import { clinicInfoService } from "@/lib/services/clinicInfoService";
import { corsResponse, handleOptions } from "@/lib/utils/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET() {
  try {
    const clinicInfo = await clinicInfoService.getClinicInfo();
    return corsResponse({ clinicInfo });
  } catch (error) {
    console.error("GET Error:", error);
    return corsResponse({ error: error.message || "Failed" }, 500);
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const result = await clinicInfoService.updateClinicInfo(data);
    
    return corsResponse({ message: "Clinic info updated", clinicInfo: result });
  } catch (error) {
    console.error("PUT Error:", error);
    return corsResponse({ error: error.message || "Failed" }, 500);
  }
}
