const mongoose = require("mongoose");

// Define the schema for the `conference` collection
const ConferenceSchema = new mongoose.Schema({
  No: { type: Number, required: true },
  Title: { type: String, required: true },
  Date: { type: String, required: true },
  Year: { type: Number, required: true },
  Venue: { type: String, required: true },
  Note: { type: String, required: true },
});

// Create the model for the `conference` collection
module.exports = mongoose.model("Conference", ConferenceSchema, "conference");
