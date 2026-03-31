import mongoose, { Schema } from "mongoose";

const QueueSchema = new Schema({
  referenceId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Patient",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Queue = mongoose.models.Queue || mongoose.model("Queue", QueueSchema);

export default Queue;
