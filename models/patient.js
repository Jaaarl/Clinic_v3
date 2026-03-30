const mongoose = require('mongoose');
const { Schema } = mongoose;

const patientSchema = new Schema({
    name: String,
    birthday: {
        type: Date,
    },
    age: {
        type: Number,
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
    medical_history: {
        allergies: [String],
        conditions: [String],
        surgeries: [String]
    },
    medications: [
        {
            name: String,
            dosage: String,
            frequency: String
        }
    ],
    visit_history: [
        {
            visit_date: String,
            soap: {
                subjective: String,
                objective: String,
                assessment: String,
                plan: String
            },
            vitals: {
                height: String,
                weight: String,
                respiratory_rate: String,
                blood_pressure: String,
                heart_rate: String,
                temperature: String
            },
            form: {
                reseta: String,
                labReq: String
            }
        }
    ],
});

const Patient = mongoose.models.patient || mongoose.model('patient', patientSchema);

module.exports = Patient;