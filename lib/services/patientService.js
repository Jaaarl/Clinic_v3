import Patient from "@/models/patient";
import connectDB from "@/libs/mongodb";

/**
 * Patient Service - All patient-related business logic
 */
export const patientService = {
  /**
   * Create a new patient
   * @param {object} data - Patient data
   * @returns {Promise<Patient>}
   */
  async createPatient({ name, gender, contact, medical_history, medications, visit_history, birthday }) {
    await connectDB();
    const patient = await Patient.create({
      name,
      gender,
      contact,
      medical_history,
      medications,
      visit_history,
      birthday,
    });
    return patient;
  },

  /**
   * Get all patients or search by name
   * @param {string} searchQuery - Optional search query
   * @returns {Promise<Patient[]>}
   */
  async getPatients(searchQuery = null) {
    await connectDB();
    if (searchQuery) {
      return Patient.find({
        name: { $regex: searchQuery, $options: "i" },
      });
    }
    return Patient.find();
  },

  /**
   * Get a single patient by ID
   * @param {string} id - Patient ID
   * @returns {Promise<Patient|null>}
   */
  async getPatientById(id) {
    await connectDB();
    return Patient.findOne({ _id: id });
  },

  /**
   * Update a patient
   * @param {string} id - Patient ID
   * @param {object} data - Update data
   * @returns {Promise<Patient>}
   */
  async updatePatient(id, { name, age, gender, contact, medical_history, medications, visit_history, birthday }) {
    await connectDB();
    return Patient.findByIdAndUpdate(
      id,
      { name, age, gender, contact, medical_history, medications, visit_history, birthday },
      { new: true }
    );
  },

  /**
   * Delete a patient
   * @param {string} id - Patient ID
   * @returns {Promise<void>}
   */
  async deletePatient(id) {
    await connectDB();
    return Patient.findByIdAndDelete(id);
  },
};
