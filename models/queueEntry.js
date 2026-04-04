import mongoose, { Schema } from "mongoose";

const statusHistorySchema = new Schema({
  status: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  changedBy: {
    type: String, // "system" | "staff" | doctorId
  },
}, { _id: false });

const queueEntrySchema = new Schema({
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
  queueType: {
    type: String,
    enum: ["SCHEDULED", "WALK_IN"],
    required: true,
  },
  appointmentId: {
    type: Schema.Types.ObjectId,
    ref: "Appointment",
  },
  visitReason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["WAITING", "WITH_DOCTOR", "DONE", "NO_SHOW"],
    default: "WAITING",
  },
  statusHistory: [statusHistorySchema],
  scheduledTime: {
    type: String, // Time slot for SCHEDULED queue
  },
  checkedInAt: Date,
  calledAt: Date,
  startedAt: Date,
  completedAt: Date,
  date: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

// Indexes
queueEntrySchema.index({ date: 1, status: 1 });
queueEntrySchema.index({ doctorId: 1, date: 1, queueType: 1 });
queueEntrySchema.index({ patientId: 1, date: 1 });

const QueueEntry = mongoose.models.QueueEntry || mongoose.model("QueueEntry", queueEntrySchema);

export default QueueEntry;
