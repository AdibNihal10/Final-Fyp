const mongoose = require("mongoose");
const RG = require("../Model/researchGroup"); // Update with the correct model path

async function cleanResearchGroups() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://127.0.0.1:27017/utm_scholars");
    console.log("Connected to MongoDB");

    // Fetch all research groups
    const groups = await RG.find({});
    console.log(`Total records fetched: ${groups.length}`);

    // Step 1: Filter out "N/A" groups
    const filteredGroups = groups.filter(
      (group) => group.researchGroup && group.researchGroup !== "N/A"
    );

    // Step 2: Remove duplicates based on the text in parentheses
    const uniqueGroups = [];
    const groupSet = new Set();

    filteredGroups.forEach((group) => {
      // Extract text within parentheses
      const match = group.researchGroup.match(/\(([^)]+)\)/);
      const groupKey = match
        ? match[1].toLowerCase().trim()
        : group.researchGroup.toLowerCase().trim();

      if (!groupSet.has(groupKey)) {
        groupSet.add(groupKey);
        uniqueGroups.push(group);
      }
    });

    console.log(
      `Unique groups after cleaning: ${uniqueGroups.map(
        (g) => g.researchGroup
      )}`
    );

    // Step 3: Write cleaned data back to the database
    await RG.deleteMany({}); // Clear the collection
    await RG.insertMany(uniqueGroups); // Reinsert cleaned data

    console.log("Database cleaned and updated successfully!");
  } catch (error) {
    console.error("Error cleaning research groups:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

// Run the cleaner function
cleanResearchGroups().catch(console.error);
