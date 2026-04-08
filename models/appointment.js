import mongoose, { Schema } from "mongoose";

const appointmentSchema = new Schema({
  patientId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "patient",
  },
  doctorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Doctor",
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
  scheduledTime: {
    type: String, // "09:00", "09:15", "09:30"
    required: true,
  },
  visitReason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["SCHEDULED", "DONE", "CANCELLED", "NO_SHOW"],
    default: "SCHEDULED",
  },
  queueEntryId: {
    type: Schema.Types.ObjectId,
    ref: "QueueEntry",
  },
}, {
  timestamps: true,
});

// Indexes for efficient queries
appointmentSchema.index({ doctorId: 1, scheduledDate: 1 });
appointmentSchema.index({ patientId: 1, scheduledDate: 1 });
appointmentSchema.index({ status: 1 });

const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);

export default Appointment;
