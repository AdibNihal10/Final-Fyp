const mongoose = require("mongoose");

const intellectualPropertySchema = new mongoose.Schema({
  ipName: { type: String, required: true }, // Intellectual Property Name
  ipLevel: { type: String, required: true }, // IP Level (e.g., NATIONAL)
  ipCategory: { type: String, required: true }, // IP Category (e.g., COPYRIGHT)
});

const scholarSchema = new mongoose.Schema({
  link: { type: String, required: true, unique: true }, // Unique link to scholar page
  name: { type: String, default: "N/A" },
  researchGroup: { type: String, default: "N/A" }, // Research Group (e.g., Smart Digital Community)
  ipFiled: { type: Number, required: true }, // Number of IPs filed
  intellectualProperties: [intellectualPropertySchema], // Array of Intellectual Properties
});

// Compile the model
const Scholar = mongoose.model("Ip", scholarSchema, "Ip_name");

module.exports = Scholar;
