import Doctor from "@/models/doctor";
import connectDB from "@/lib/mongodb";

export const doctorService = {
  async createDoctor({ name, lic, ptr, s2 }) {
    if (!name || !lic) {
      throw new Error("name and license number are required");
    }

    await connectDB();
    return Doctor.create({ name, lic, ptr, s2 });
  },

  async getDoctors() {
    await connectDB();
    return Doctor.find();
  },

  async getDoctorById(id) {
    await connectDB();
    return Doctor.findOne({ _id: id });
  },

  async updateDoctor(id, { name, lic, ptr, s2 }) {
    if (!name || !lic) {
      throw new Error("name and license number are required");
    }

    await connectDB();
    return Doctor.findByIdAndUpdate(id, { name, lic, ptr, s2 }, { new: true });
  },
};
