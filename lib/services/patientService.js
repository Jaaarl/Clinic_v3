import Patient from "@/models/patient";
import connectDB from "@/lib/mongodb";
import { isValidGender } from "@/lib/utils/validation";

export const patientService = {
  async createPatient(data) {
    await connectDB();

    const { name, birthday, gender, contact, medical_history, medications } = data;

    if (!name) {
      throw new Error("Name is required");
    }

    if (gender && !isValidGender(gender)) {
      throw new Error("Invalid gender. Must be 'male' or 'female'");
    }

    const newPatient = new Patient({
      name,
      birthday,
      gender,
      contact,
      medical_history,
      medications,
    });

    await newPatient.save();
    return newPatient;
  },

  async getPatients(searchQuery = null, page = 1, limit = 10) {
    await connectDB();

    const skip = (page - 1) * limit;
    let query = {};
    let sort = { createdAt: -1 }; // Newest first by default

    if (searchQuery) {
      query = { name: { $regex: searchQuery, $options: "i" } };
    }

    const [patients, total] = await Promise.all([
      Patient.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Patient.countDocuments(query),
    ]);

    return {
      patients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  },

  async getPatientById(id) {
    await connectDB();
    return Patient.findById(id).lean();
  },

  async updatePatient(id, data) {
    await connectDB();

    const { name, birthday, gender, contact, medical_history, medications } = data;

    if (!name) {
      throw new Error("Name is required");
    }

    if (gender && !isValidGender(gender)) {
      throw new Error("Invalid gender. Must be 'male' or 'female'");
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
      { name, birthday, gender, contact, medical_history, medications },
      { new: true, runValidators: true }
    );

    return updatedPatient;
  },

  async deletePatient(id) {
    await connectDB();
    return Patient.findByIdAndDelete(id);
  },
};
