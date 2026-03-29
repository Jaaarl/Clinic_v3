import Prescription from "@/models/prescription";
import connectDB from "@/libs/mongodb";

/**
 * Prescription Service - All prescription-related business logic
 */
export const prescriptionService = {
  /**
   * Create a new prescription
   * @param {object} data - Prescription data
   * @returns {Promise<Prescription>}
   */
  async createPrescription({
    patientId,
    visitId,
    doctorName,
    doctorLicense,
    doctorPtr,
    doctorS2,
    medicines,
    notes,
  }) {
    await connectDB();
    return Prescription.create({
      patientId,
      visitId,
      doctorName,
      doctorLicense,
      doctorPtr,
      doctorS2,
      medicines,
      notes,
    });
  },

  /**
   * Get prescriptions by patient ID
   * @param {string} patientId - Patient ID
   * @returns {Promise<Prescription[]>}
   */
  async getPrescriptionsByPatientId(patientId) {
    await connectDB();
    return Prescription.find({ patientId }).sort({ date: -1 });
  },

  /**
   * Get a single prescription by ID
   * @param {string} id - Prescription ID
   * @returns {Promise<Prescription|null>}
   */
  async getPrescriptionById(id) {
    await connectDB();
    return Prescription.findById(id);
  },
};
