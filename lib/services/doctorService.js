import Doctor from "@/models/doctor";
import connectDB from "@/libs/mongodb";

export const doctorService = {
  async createDoctor({ name, lic, ptr, s2 }) {
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
    await connectDB();
    return Doctor.findByIdAndUpdate(id, { name, lic, ptr, s2 }, { new: true });
  },
};
