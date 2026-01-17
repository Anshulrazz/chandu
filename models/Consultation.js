const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    experience: String,
    message: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Consultation", consultationSchema);
