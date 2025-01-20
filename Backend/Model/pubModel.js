const mongoose = require("mongoose");

const publicationSchema = new mongoose.Schema({
  journalName: { type: String, required: true },
  publicationCategory: { type: String, default: "N/A" },
  typeOfAuthors: { type: String, default: "N/A" },
  year: { type: String, required: true },
});

const scholarSchema = new mongoose.Schema({
  name: { type: String, required: true },
  link: { type: String, required: true, unique: true },
  researchGroup: { type: String, default: "N/A" },
  totalJournals: { type: Number, default: 0 },
  publications: [publicationSchema], // Array of publications
});

const Scholar = mongoose.model("Pub", scholarSchema, "Publication");

module.exports = Scholar;
