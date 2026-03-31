import mongoose from 'mongoose';
import { Schema } from mongoose;

const doctorSchema = new Schema({
    name: String,
    lic: String,
    ptr: String,
    s2: String,
});

const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);

export default Doctor;
