import mongoose, { Schema } from "mongoose";

const patientSchema = new Schema({
  name: String,
  birthday: {
    type: Date,
  },
  gender: String,
  contact: {
    phone: String,
    email: String,
    address: {
      street: String,
      city: String,
      province: String,
      zip: String,
    },
    gender: String,
    contact: {
        phone: String,
        email: String,
        address: {
            street: String,
            city: String,
            province: String,
            zip: String
        }
    },
  ],
});

const Patient =
  mongoose.models.patient || mongoose.model("patient", patientSchema);

export default Patient;
