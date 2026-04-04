import mongoose, { Schema } from "mongoose";

const doctorScheduleSchema = new Schema({
  doctorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Doctor",
  },
  dayOfWeek: {
    type: Number, // 0=Sunday, 1=Monday, ..., 6=Saturday
    required: true,
    min: 0,
    max: 6,
  },
  slotDuration: {
    type: Number, // in minutes (e.g., 15)
    default: 15,
  },
  startTime: {
    type: String, // "08:00"
    required: true,
  },
  endTime: {
    type: String, // "17:00"
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes
doctorScheduleSchema.index({ doctorId: 1, dayOfWeek: 1 }, { unique: true });

const DoctorSchedule = mongoose.models.DoctorSchedule || mongoose.model("DoctorSchedule", doctorScheduleSchema);

export default DoctorSchedule;
