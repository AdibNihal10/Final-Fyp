const mongoose = require("mongoose");

// Schema for MoU/MoA/LoC/LoI Agreements
const MouMoASchema = new mongoose.Schema({
  No: { type: Number, required: true },
  Description: { type: String, required: true },
  Type: { type: String, required: true },
  StartYear: { type: String, required: true },
  EndYear: { type: String, required: true },
  YearStart: { type: Number, required: true },
  YearEnd: { type: Number, required: true },
  PIC: { type: String }, // Optional if PIC is missing in some entries
});

// Create and export the model
module.exports = mongoose.model("MouMoA", MouMoASchema, "networking");
