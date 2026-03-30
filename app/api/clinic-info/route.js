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
    console.log("PUT /api/clinic-info - received:", JSON.stringify(data, null, 2));
    
    const result = await clinicInfoService.updateClinicInfo(data);
    console.log("PUT /api/clinic-info - result:", JSON.stringify(result, null, 2));
    
    return corsResponse({ message: "Clinic info updated", clinicInfo: result });
  } catch (error) {
    console.error("PUT Error:", error);
    return corsResponse({ error: error.message || "Failed" }, 500);
  }
}
