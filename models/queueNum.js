import mongoose, { Schema } from "mongoose";

const QueueNumSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const QueueNum =
  mongoose.models.QueueNum || mongoose.model("QueueNum", QueueNumSchema);

export default QueueNum;
