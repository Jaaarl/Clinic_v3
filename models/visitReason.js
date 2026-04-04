import mongoose, { Schema } from "mongoose";

const visitReasonSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const VisitReason = mongoose.models.VisitReason || mongoose.model("VisitReason", visitReasonSchema);

export default VisitReason;
