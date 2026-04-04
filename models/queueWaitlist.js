import mongoose, { Schema } from "mongoose";

const queueWaitlistSchema = new Schema({
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
  visitReason: {
    type: String,
    required: true,
  },
  preferredDate: {
    type: Date,
    required: true,
  },
  preferredTime: {
    type: String, // Time slot preference
  },
  position: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["WAITING", "BOOKED", "EXPIRED", "CANCELLED"],
    default: "WAITING",
  },
}, {
  timestamps: true,
});

// Indexes
queueWaitlistSchema.index({ doctorId: 1, preferredDate: 1, status: 1 });
queueWaitlistSchema.index({ patientId: 1 });

const QueueWaitlist = mongoose.models.QueueWaitlist || mongoose.model("QueueWaitlist", queueWaitlistSchema);

export default QueueWaitlist;
