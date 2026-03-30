import ClinicInfo from "@/models/clinicInfo";
import connectDB from "@/libs/mongodb";

export const clinicInfoService = {
  async getClinicInfo() {
    await connectDB();
    let clinicInfo = await ClinicInfo.findOne({ isActive: true });
    
    // If no clinic info exists, create default
    if (!clinicInfo) {
      clinicInfo = new ClinicInfo({
        clinics: [
          {
            name: "CLINIC_NAME",
            addresses: [
              {
                street: "CLINIC_ADDRESS",
                label: "Main",
                city: "",
                province: "",
                zip: "",
              },
            ],
            operatingHours: [
              {
                label: "Hours",
                schedule: "CLINIC_HOURS",
              },
            ],
            phone: "",
            email: "",
          },
        ],
        isActive: true,
      });
      await clinicInfo.save();
    }
    
    return clinicInfo;
  },

  async updateClinicInfo(data) {
    await connectDB();
    
    // Find existing or create new
    let clinicInfo = await ClinicInfo.findOne({ isActive: true });
    
    if (!clinicInfo) {
      // Create new with provided data
      clinicInfo = new ClinicInfo({
        clinics: data.clinics,
        isActive: true,
      });
    } else {
      // Update existing
      clinicInfo.clinics = data.clinics;
      clinicInfo.updatedAt = new Date();
    }
    
    await clinicInfo.save();
    return clinicInfo;
  },

  async getClinicByIndex(index) {
    const clinicInfo = await this.getClinicInfo();
    if (clinicInfo?.clinics?.[index]) {
      return clinicInfo.clinics[index];
    }
    return null;
  },
};
