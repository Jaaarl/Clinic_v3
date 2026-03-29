const mongoose = require("mongoose");
const { Schema } = mongoose;

const logSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  exp: {
    type: Date,
  },
  quantityDeducted: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Log = mongoose.models.Log || mongoose.model("Log", logSchema);
export default Log;
