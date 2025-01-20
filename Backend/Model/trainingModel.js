// trainingModel.js
const mongoose = require("mongoose");

const TrainingProjectSchema = new mongoose.Schema({
  Bil: Number,
  KetuaProjek: String,
  Vot: Number,
  TajukProjek: String,
  Klien: String,
  KosProjek: Number,
  Year: Number,
});

module.exports = mongoose.model(
  "TrainingProject",
  TrainingProjectSchema,
  "training_2024"
);
