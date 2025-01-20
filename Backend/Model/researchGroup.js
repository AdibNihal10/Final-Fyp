const mongoose = require("mongoose");

const scholarSchema = new mongoose.Schema({
  link: { type: String, required: true },
  name: { type: String, default: "N/A" },
  GRANT_PI_MEMBERS: String,

  PUBLICATIONS: Number,
  INDEXED_PUBLICATION: String,
  TOTAL_STUDENTS: String,
  H_INDEXED_SCOPUS: String,
  CITATIONS_SCOPUS: String,
  INDUSTRY_GRANTS: String,
  INTERNATIONAL_GRANTS: String,
  NATIONAL_GRANTS: String,
  UNIVERSITY_FUND: String,
  TOTAL: Number,
  NON_INDEXED_PUBLICATION: String,
  OTHERS_PUBLICATION: String,
  MASTER: Number,
  PHD: Number,
  researchGroup: { type: String, default: "N/A" }, // Added field for Research Group
});

module.exports = mongoose.model(
  "ResearchGroup",
  scholarSchema,
  "researchgroup"
);
