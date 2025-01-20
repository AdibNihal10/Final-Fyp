const mongoose = require("mongoose");

// Grant Schema
const grantSchema = new mongoose.Schema({
  grantName: { type: String, required: true },
  sponsor: { type: String, required: true }, // Sponsor name
  type: { type: String, required: true }, // Type of grant (e.g., Contract Research)
  year: { type: String, required: true }, // Year of the grant
});

// Scholar Schema
const scholarSchema = new mongoose.Schema({
  link: { type: String, required: true, unique: true },
  name: { type: String, default: "N/A" }, // Unique link to scholar page
  researchGroup: { type: String, default: "N/A" }, // Research Group

  grantsCount: { type: Number, default: 0 }, // Number of Grants
  grants: [grantSchema], // Array of Grants
});

// Compile the model
const Scholar = mongoose.model("Grant", scholarSchema, "Grants2");

module.exports = Scholar;
