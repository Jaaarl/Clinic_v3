import Doctor from "@/models/doctor";
import connectDB from "@/libs/mongodb";

/**
 * Doctor Service - All doctor-related business logic
 */
export const doctorService = {
  /**
   * Create a new doctor
   * @param {object} data - Doctor data
   * @returns {Promise<Doctor>}
   */
  async createDoctor({ name, lic, ptr, s2 }) {
    await connectDB();
    return Doctor.create({ name, lic, ptr, s2 });
  },

  /**
   * Get all doctors
   * @returns {Promise<Doctor[]>}
   */
  async getDoctors() {
    await connectDB();
    return Doctor.find();
  },

  /**
   * Get a single doctor by ID
   * @param {string} id - Doctor ID
   * @returns {Promise<Doctor|null>}
   */
  async getDoctorById(id) {
    await connectDB();
    return Doctor.findOne({ _id: id });
  },

  /**
   * Update a doctor
   * @param {string} id - Doctor ID
   * @param {object} data - Update data
   * @returns {Promise<Doctor>}
   */
  async updateDoctor(id, { name, lic, ptr, s2 }) {
    await connectDB();
    return Doctor.findByIdAndUpdate(
      id,
      { name, lic, ptr, s2 },
      { new: true }
    );
  },
};
