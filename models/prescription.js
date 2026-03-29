const mongoose = require('mongoose');
const { Schema } = mongoose;

const medicineSchema = new Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  duration: { type: String, required: true },
  instructions: { type: String, default: '' }
}, { _id: false });

const prescriptionSchema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'patient', required: true },
  visitId: { type: String },
  doctorName: { type: String, required: true },
  doctorLicense: { type: String, required: true },
  doctorPtr: { type: String },
  doctorS2: { type: String },
  date: { type: Date, default: Date.now },
  medicines: { type: [medicineSchema], required: true },
  notes: { type: String, default: '' }
});

const Prescription = mongoose.models.prescription || mongoose.model('prescription', prescriptionSchema);

module.exports = Prescription;
