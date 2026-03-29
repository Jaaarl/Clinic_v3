import Patient from "@/models/patient";
import connectDB from "@/libs/mongodb";

export const patientService = {
  async createPatient({ name, gender, contact, medical_history, medications, visit_history, birthday }) {
    await connectDB();
    return Patient.create({ name, gender, contact, medical_history, medications, visit_history, birthday });
  },

  async getPatients(searchQuery = null) {
    await connectDB();
    if (searchQuery) {
      return Patient.find({ name: { $regex: searchQuery, $options: "i" } });
    }
    return Patient.find();
  },

  async getPatientById(id) {
    await connectDB();
    return Patient.findOne({ _id: id });
  },

  async updatePatient(id, { name, age, gender, contact, medical_history, medications, visit_history, birthday }) {
    await connectDB();
    return Patient.findByIdAndUpdate(
      id,
      { name, age, gender, contact, medical_history, medications, visit_history, birthday },
      { new: true }
    );
  },

  async deletePatient(id) {
    await connectDB();
    return Patient.findByIdAndDelete(id);
  },
};
