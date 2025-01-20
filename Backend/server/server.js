// // server.js
// const express = require("express");
// const mongoose = require("mongoose");
// const Scholar = require("../Model/scholarsModel");

// const app = express();
// const PORT = 5000;
// const cors = require("cors");
// app.use(cors());
// mongoose.connect("mongodb://127.0.0.1:27017/utm_scholars", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// app.get("/api/grants", async (req, res) => {
//   try {
//     // Debug: Log raw data before the aggregation
//     const rawData = await Scholar.find(
//       {},
//       { NATIONAL_GRANTS: 1, INTERNATIONAL_GRANTS: 1, INDUSTRY_GRANTS: 1 }
//     ).lean();
//     console.log("Raw data:", rawData);

//     const grantsData = await Scholar.aggregate([
//       {
//         $addFields: {
//           NATIONAL_GRANTS_INT: { $toInt: "$NATIONAL_GRANTS" },
//           INTERNATIONAL_GRANTS_INT: { $toInt: "$INTERNATIONAL_GRANTS" },
//           INDUSTRY_GRANTS_INT: { $toInt: "$INDUSTRY_GRANTS" },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalNationalGrants: { $sum: "$NATIONAL_GRANTS_INT" },
//           totalInternationalGrants: { $sum: "$INTERNATIONAL_GRANTS_INT" },
//           totalIndustryGrants: { $sum: "$INDUSTRY_GRANTS_INT" },
//         },
//       },
//     ]);

//     console.log("Aggregated data:", grantsData);

//     const {
//       totalNationalGrants,
//       totalInternationalGrants,
//       totalIndustryGrants,
//     } = grantsData[0] || {
//       totalNationalGrants: 0,
//       totalInternationalGrants: 0,
//       totalIndustryGrants: 0,
//     };

//     res.json({
//       nationalGrants: totalNationalGrants,
//       internationalGrants: totalInternationalGrants,
//       industryGrants: totalIndustryGrants,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error fetching grants data");
//   }
// });

// app.get("/api/publications", async (req, res) => {
//   try {
//     // Debug: Log raw data before the aggregation
//     const rawData = await Scholar.find(
//       {},
//       {
//         INDEXED_PUBLICATION: 1,
//         NON_INDEXED_PUBLICATION: 1,
//         OTHERS_PUBLICATION: 1,
//       }
//     ).lean();
//     console.log("Raw data:", rawData);

//     // Aggregate indexed, non-indexed, and other publications
//     const publicationData = await Scholar.aggregate([
//       {
//         $addFields: {
//           INDEXED_PUBLICATION_INT: { $toInt: "$INDEXED_PUBLICATION" },
//           NON_INDEXED_PUBLICATION_INT: { $toInt: "$NON_INDEXED_PUBLICATION" },
//           OTHERS_PUBLICATION_INT: { $toInt: "$OTHERS_PUBLICATION" },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalIndexedPublications: { $sum: "$INDEXED_PUBLICATION_INT" },
//           totalNonIndexedPublications: { $sum: "$NON_INDEXED_PUBLICATION_INT" },
//           totalOtherPublications: { $sum: "$OTHERS_PUBLICATION_INT" },
//         },
//       },
//     ]);

//     console.log("Aggregated data:", publicationData);

//     const {
//       totalIndexedPublications,
//       totalNonIndexedPublications,
//       totalOtherPublications,
//     } = publicationData[0] || {
//       totalIndexedPublications: 0,
//       totalNonIndexedPublications: 0,
//       totalOtherPublications: 0,
//     };

//     res.json({
//       indexedPublications: totalIndexedPublications,
//       nonIndexedPublications: totalNonIndexedPublications,
//       otherPublications: totalOtherPublications,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error fetching publication data");
//   }
// });
// app.get("/api/scopusData", async (req, res) => {
//   try {
//     // Debug: Log raw data before the aggregation
//     const rawData = await Scholar.find(
//       {},
//       { H_INDEXED_SCOPUS: 1, CITATIONS_SCOPUS: 1, PUBLICATIONS: 1 }
//     ).lean();
//     console.log("Raw data:", rawData);

//     // Aggregate H-Index Scopus, Citations Scopus, and Publications
//     const scopusData = await Scholar.aggregate([
//       {
//         $addFields: {
//           H_INDEXED_SCOPUS_INT: { $toInt: "$H_INDEXED_SCOPUS" },
//           CITATIONS_SCOPUS_INT: { $toInt: "$CITATIONS_SCOPUS" },
//           PUBLICATIONS_INT: { $toInt: "$PUBLICATIONS" },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalHIndexedScopus: { $sum: "$H_INDEXED_SCOPUS_INT" },
//           totalCitationsScopus: { $sum: "$CITATIONS_SCOPUS_INT" },
//           totalPublications: { $sum: "$PUBLICATIONS_INT" },
//         },
//       },
//     ]);

//     console.log("Aggregated data:", scopusData);

//     const { totalHIndexedScopus, totalCitationsScopus, totalPublications } =
//       scopusData[0] || {
//         totalHIndexedScopus: 0,
//         totalCitationsScopus: 0,
//         totalPublications: 0,
//       };

//     res.json({
//       hIndexedScopus: totalHIndexedScopus,
//       citationsScopus: totalCitationsScopus,
//       publications: totalPublications,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error fetching Scopus data");
//   }
// });

// app.listen(PORT, () =>
//   console.log(`Server running on http://localhost:${PORT}`)
// );

// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Scholar = require("../Model/scholarsModel"); // Model for utm_scholars
const TrainingProject = require("../Model/trainingModel"); // Model for training_2024
const Conference = require("../Model/conferenceModel"); // Import Conference model
const MouMoA = require("../Model/networking");
const RG = require("../Model/researchGroup");
const iPFile = require("../Model/ipModel");
const grants = require("../Model/grantModel");
const pub = require("../Model/pubModel");
const app = express();
const PORT = 5000;
const { login } = require("../Controller/loginControl");
const authRoutes = require("./routes/auth");
// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/utm_scholars", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB: utm_scholars"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Endpoints

// 1. Grants Data Endpoint
// app.get("/api/grants", async (req, res) => {
//   try {
//     const grantsData = await RG.aggregate([
//       {
//         $addFields: {
//           NATIONAL_GRANTS_INT: { $toInt: "$NATIONAL_GRANTS" },
//           INTERNATIONAL_GRANTS_INT: { $toInt: "$INTERNATIONAL_GRANTS" },
//           INDUSTRY_GRANTS_INT: { $toInt: "$INDUSTRY_GRANTS" },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalNationalGrants: { $sum: "$NATIONAL_GRANTS_INT" },
//           totalInternationalGrants: { $sum: "$INTERNATIONAL_GRANTS_INT" },
//           totalIndustryGrants: { $sum: "$INDUSTRY_GRANTS_INT" },
//         },
//       },
//     ]);

//     const {
//       totalNationalGrants = 0,
//       totalInternationalGrants = 0,
//       totalIndustryGrants = 0,
//     } = grantsData[0] || {};

//     res.json({
//       nationalGrants: totalNationalGrants,
//       internationalGrants: totalInternationalGrants,
//       industryGrants: totalIndustryGrants,
//     });
//   } catch (err) {
//     console.error("Error fetching grants data:", err);
//     res.status(500).send("Error fetching grants data");
//   }
// });

authRoutes(app);
app.get("/api/grants", async (req, res) => {
  try {
    const { researchGroup } = req.query;
    const match = researchGroup ? { researchGroup } : {};

    const grantsData = await RG.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          nationalGrants: { $sum: { $toInt: "$NATIONAL_GRANTS" } },
          internationalGrants: { $sum: { $toInt: "$INTERNATIONAL_GRANTS" } },
          industryGrants: { $sum: { $toInt: "$INDUSTRY_GRANTS" } },
        },
      },
    ]);

    res.json(grantsData[0] || {});
  } catch (err) {
    console.error("Error fetching grants data:", err);
    res.status(500).send("Failed to fetch grants data.");
  }
});
//publication
// app.get("/api/allpublications", async (req, res) => {
//   try {
//     const { researchGroup } = req.query; // Optional filter by researchGroup

//     // Query the database
//     const query = researchGroup ? { researchGroup } : {}; // Filter by researchGroup if provided
//     const scholars = await pub.find(query);

//     // Process data for stacked bar chart
//     const groupedData = scholars.reduce((acc, scholar) => {
//       scholar.publications.forEach((pub) => {
//         const year = pub.year || "Unknown";
//         const category =
//           pub.publicationCategory === "Publication In Web Of Science"
//             ? "webOfScience"
//             : pub.publicationCategory === "Publication In Scopus"
//             ? "scopus"
//             : "other";

//         // Find or create a year entry
//         let yearEntry = acc.find((entry) => entry.year === year);
//         if (!yearEntry) {
//           yearEntry = {
//             year,
//             webOfScience: 0,
//             scopus: 0,
//             other: 0,

//             details: [], // Include details for table
//           };
//           acc.push(yearEntry);
//         }

//         // Increment category count
//         yearEntry[category]++;

//         // Add detailed publication data
//         yearEntry.details.push({
//           scholarName: scholar.name,
//           journalName: pub.journalName,
//           typeOfAuthors: pub.typeOfAuthors,
//         });
//       });
//       return acc;
//     }, []);

//     // Respond with grouped data
//     res.status(200).json(groupedData);
//   } catch (error) {
//     console.error("Error fetching publication data :", error);
//     res.status(500).json({ error: "An error occurred while fetching data." });
//   }
// });

//IpFiled
app.get("/api/ipData", async (req, res) => {
  try {
    const { researchGroup } = req.query; // Extract research group filter from query parameters
    const match = researchGroup ? { researchGroup } : {}; // Match condition for filtering

    const ipData = await iPFile.aggregate([
      { $match: match }, // Apply filter if researchGroup is provided
      {
        $group: {
          _id: "$researchGroup",
          totalIpFiled: { $sum: "$ipFiled" },
        },
      },
    ]);

    res.json(ipData);
  } catch (err) {
    console.error("Error fetching IP data:", err);
    res.status(500).send("Error fetching IP data");
  }
});

// 2. Publications Data Endpoint
app.get("/api/publications", async (req, res) => {
  try {
    const { researchGroup } = req.query; // Extract the researchGroup filter from query parameters
    const match = researchGroup ? { researchGroup } : {}; // Match condition for filtering

    const publicationData = await RG.aggregate([
      { $match: match }, // Apply filter if researchGroup is provided
      {
        $addFields: {
          INDEXED_PUBLICATION_INT: { $toInt: "$INDEXED_PUBLICATION" },
          NON_INDEXED_PUBLICATION_INT: { $toInt: "$NON_INDEXED_PUBLICATION" },
          OTHERS_PUBLICATION_INT: { $toInt: "$OTHERS_PUBLICATION" },
        },
      },
      {
        $group: {
          _id: null,
          totalIndexedPublications: { $sum: "$INDEXED_PUBLICATION_INT" },
          totalNonIndexedPublications: { $sum: "$NON_INDEXED_PUBLICATION_INT" },
          totalOtherPublications: { $sum: "$OTHERS_PUBLICATION_INT" },
        },
      },
    ]);

    const {
      totalIndexedPublications = 0,
      totalNonIndexedPublications = 0,
      totalOtherPublications = 0,
    } = publicationData[0] || {};

    res.json({
      indexedPublications: totalIndexedPublications,
      nonIndexedPublications: totalNonIndexedPublications,
      otherPublications: totalOtherPublications,
    });
  } catch (err) {
    console.error("Error fetching publication data:", err);
    res.status(500).send("Error fetching publication data");
  }
});

// 3. Scopus Data Endpoint
app.get("/api/scopusData", async (req, res) => {
  try {
    const { researchGroup } = req.query; // Extract the researchGroup filter from query parameters
    const match = researchGroup ? { researchGroup } : {}; // Match condition for filtering

    const scopusData = await RG.aggregate([
      { $match: match }, // Apply filter if researchGroup is provided
      {
        $addFields: {
          H_INDEXED_SCOPUS_INT: { $toInt: "$H_INDEXED_SCOPUS" },
          CITATIONS_SCOPUS_INT: { $toInt: "$CITATIONS_SCOPUS" },
          PUBLICATIONS_INT: { $toInt: "$PUBLICATIONS" },
        },
      },
      {
        $group: {
          _id: null,
          totalHIndexedScopus: { $sum: "$H_INDEXED_SCOPUS_INT" },
          totalCitationsScopus: { $sum: "$CITATIONS_SCOPUS_INT" },
          totalPublications: { $sum: "$PUBLICATIONS_INT" },
        },
      },
    ]);

    const {
      totalHIndexedScopus = 0,
      totalCitationsScopus = 0,
      totalPublications = 0,
    } = scopusData[0] || {};

    res.json({
      hIndexedScopus: totalHIndexedScopus,
      citationsScopus: totalCitationsScopus,
      publications: totalPublications,
    });
  } catch (err) {
    console.error("Error fetching Scopus data:", err);
    res.status(500).send("Error fetching Scopus data");
  }
});
app.get("/api/citationsScopusByResearchGroup", async (req, res) => {
  try {
    // Aggregate data by researchGroup
    const aggregatedData = await RG.aggregate([
      {
        $match: {
          CITATIONS_SCOPUS: { $ne: null }, // Ensure valid CITATIONS_SCOPUS values
          researchGroup: { $ne: "N/A" }, // Exclude invalid research groups
        },
      },
      {
        $group: {
          _id: "$researchGroup", // Group by researchGroup
          totalCitationsScopus: {
            $sum: {
              $toInt: "$CITATIONS_SCOPUS", // Sum up the CITATIONS_SCOPUS values
            },
          },
        },
      },
      {
        $project: {
          _id: 0, // Exclude default _id field
          researchGroup: "$_id", // Rename _id field to researchGroup
          citationsScopus: "$totalCitationsScopus", // Rename to citationsScopus
        },
      },
      {
        $sort: { citationsScopus: -1 }, // Sort by citations in descending order
      },
    ]);

    res.status(200).json(aggregatedData); // Send the aggregated data as JSON response
  } catch (error) {
    console.error("Error fetching Citations Scopus data:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});
app.get("/api/hIndexScopusByResearchGroup", async (req, res) => {
  try {
    // Fetch all data from the database
    const groups = await RG.find({});

    // Aggregate data by research group
    const groupedData = groups.reduce((acc, group) => {
      const researchGroup = group.researchGroup || "Unknown";
      const hIndexedScopus = parseInt(group.H_INDEXED_SCOPUS || 0);

      if (!acc[researchGroup]) {
        acc[researchGroup] = {
          researchGroup,
          hIndexScopus: 0,
        };
      }

      acc[researchGroup].hIndexScopus += hIndexedScopus;
      return acc;
    }, {});

    // Convert grouped data into an array
    const result = Object.values(groupedData);

    // Respond with aggregated data
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching H-index Scopus data:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});

app.get("/api/piData", async (req, res) => {
  try {
    const { researchGroup } = req.query; // Extract the researchGroup filter from query parameters
    const match = researchGroup ? { researchGroup } : {}; // Match condition for filtering

    const piData = await RG.aggregate([
      { $match: match }, // Apply filter if researchGroup is provided
      {
        $addFields: {
          H_INDEXED_SCOPUS_INT: { $toInt: "$H_INDEXED_SCOPUS" },
          CITATIONS_SCOPUS_INT: { $toInt: "$CITATIONS_SCOPUS" },
          GRANT_PI_MEMBERS_INT: { $toInt: "$GRANT_PI_MEMBERS" },
        },
      },
      {
        $group: {
          _id: null,
          totalHIndexedScopus: { $sum: "$H_INDEXED_SCOPUS_INT" },
          totalCitationsScopus: { $sum: "$CITATIONS_SCOPUS_INT" },
          totalPi: { $sum: "$GRANT_PI_MEMBERS_INT" },
        },
      },
    ]);

    const {
      totalHIndexedScopus = 0,
      totalCitationsScopus = 0,
      totalPi = 0,
    } = piData[0] || {};

    res.json({
      hIndexedScopus: totalHIndexedScopus,
      citationsScopus: totalCitationsScopus,
      Pi: totalPi,
    });
  } catch (err) {
    console.error("Error fetching Scopus data:", err);
    res.status(500).send("Error fetching Scopus data");
  }
});

//RG
app.get("/api/research-groups", async (req, res) => {
  try {
    const groups = await RG.distinct("researchGroup");
    res.json(groups);
  } catch (err) {
    console.error("Error fetching research groups:", err);
    res.status(500).send("Failed to fetch research groups.");
  }
});
app.get("/api/allconferences", async (req, res) => {
  try {
    // Fetch all conferences from the MongoDB collection
    const conferences = await Conference.find();

    // Group conferences by year
    const formattedData = conferences.reduce((acc, conference) => {
      const { Year } = conference;

      if (!acc[Year]) {
        acc[Year] = {
          year: Year,
          totalConferences: 0,
          details: [],
        };
      }

      acc[Year].totalConferences += 1;
      acc[Year].details.push(conference);

      return acc;
    }, {});

    // Convert the grouped object to an array for frontend compatibility
    const result = Object.values(formattedData);

    res.json(result);
  } catch (error) {
    console.error("Error fetching conference data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/Tprojects", async (req, res) => {
  try {
    // Fetch all training projects from the database
    const trainingProjects = await TrainingProject.find();

    // Group data by year
    const formattedData = trainingProjects.reduce((acc, project) => {
      const { Year } = project;

      if (!acc[Year]) {
        acc[Year] = {
          year: Year,
          totalTrainings: 0,
          projects: [],
        };
      }

      acc[Year].totalTrainings += 1;
      acc[Year].projects.push(project);

      return acc;
    }, {});

    // Convert the grouped object to an array for better frontend compatibility
    const result = Object.values(formattedData);

    res.json(result);
  } catch (error) {
    console.error("Error fetching training projects data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 4. Training Projects Endpoint (training_2024 data)
app.get("/api/trainingProjects", async (req, res) => {
  try {
    const projects = await TrainingProject.find({});
    res.json(projects);
  } catch (err) {
    console.error("Error fetching training projects:", err);
    res.status(500).send("Error fetching training projects");
  }
});
app.post("/api/trainingProjects", async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debug incoming data
    const newProject = new TrainingProject({
      Bil: Number(req.body.Bil),
      KetuaProjek: String(req.body.KetuaProjek),
      Vot: Number(req.body.Vot),
      TajukProjek: String(req.body.TajukProjek),
      Klien: String(req.body.Klien),
      KosProjek: Number(req.body.KosProjek),
      Year: Number(req.body.Year), // Ensure Year is a number
    });

    const savedProject = await newProject.save();
    console.log("Saved project:", savedProject); // Debug saved data
    res.status(201).json(savedProject);
  } catch (err) {
    console.error("Error saving training project:", err);
    res.status(500).send("Error saving training project");
  }
});

// 3. Update Training Project by ID (PUT)
app.put("/api/trainingProjects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProject = await TrainingProject.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true, // Return the updated document
      }
    );
    if (!updatedProject) return res.status(404).send("Project not found");
    res.json(updatedProject);
  } catch (err) {
    console.error("Error updating training project:", err);
    res.status(500).send("Error updating training project");
  }
});

// 4. Delete Training Project by ID (DELETE)
app.delete("/api/trainingProjects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await TrainingProject.findByIdAndDelete(id);
    if (!deletedProject) return res.status(404).send("Project not found");
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Error deleting training project:", err);
    res.status(500).send("Error deleting training project");
  }
});
// Fetch all conferences
app.get("/api/conferences", async (req, res) => {
  try {
    const conferences = await Conference.find({});
    res.json(conferences);
  } catch (err) {
    console.error("Error fetching conferences:", err);
    res.status(500).send("Error fetching conferences");
  }
});

// Add a new conference
app.post("/api/conferences", async (req, res) => {
  try {
    const newConference = new Conference(req.body);
    const savedConference = await newConference.save();
    res.status(201).json(savedConference);
  } catch (err) {
    console.error("Error saving conference:", err);
    res.status(500).send("Error saving conference");
  }
});

// Update a conference by ID
app.put("/api/conferences/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedConference = await Conference.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
    });
    if (!updatedConference) return res.status(404).send("Conference not found");
    res.json(updatedConference);
  } catch (err) {
    console.error("Error updating conference:", err);
    res.status(500).send("Error updating conference");
  }
});

// Delete a conference by ID
app.delete("/api/conferences/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedConference = await Conference.findByIdAndDelete(id);
    if (!deletedConference) return res.status(404).send("Conference not found");
    res.json({ message: "Conference deleted successfully" });
  } catch (err) {
    console.error("Error deleting conference:", err);
    res.status(500).send("Error deleting conference");
  }
});
//Networking
app.get("/api/networking", async (req, res) => {
  try {
    // Fetch all agreements from the MongoDB collection
    const agreements = await MouMoA.find();

    // Group agreements by type
    const groupedData = agreements.reduce((acc, agreement) => {
      const { Type } = agreement;

      if (!acc[Type]) {
        acc[Type] = {
          type: Type,
          total: 0,
          details: [],
        };
      }

      acc[Type].total += 1; // Increment the total count
      acc[Type].details.push(agreement); // Add the agreement to the details array

      return acc;
    }, {});

    // Convert the grouped object to an array for frontend compatibility
    const result = Object.values(groupedData);

    res.json(result); // Send the response
  } catch (error) {
    console.error("Error fetching networking data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fetch all agreements
app.get("/api/moumoa", async (req, res) => {
  try {
    const agreements = await MouMoA.find({});
    res.json(agreements);
  } catch (err) {
    console.error("Error fetching agreements:", err);
    res.status(500).send("Error fetching agreements");
  }
});

// Add a new agreement
app.post("/api/moumoa", async (req, res) => {
  try {
    const newAgreement = new MouMoA(req.body);
    const savedAgreement = await newAgreement.save();
    res.status(201).json(savedAgreement);
  } catch (err) {
    console.error("Error saving agreement:", err);
    res.status(500).send("Error saving agreement");
  }
});

// Update an agreement by ID
app.put("/api/moumoa/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAgreement = await MouMoA.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
    });
    if (!updatedAgreement) return res.status(404).send("Agreement not found");
    res.json(updatedAgreement);
  } catch (err) {
    console.error("Error updating agreement:", err);
    res.status(500).send("Error updating agreement");
  }
});

// Delete an agreement by ID
app.delete("/api/moumoa/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAgreement = await MouMoA.findByIdAndDelete(id);
    if (!deletedAgreement) return res.status(404).send("Agreement not found");
    res.json({ message: "Agreement deleted successfully" });
  } catch (err) {
    console.error("Error deleting agreement:", err);
    res.status(500).send("Error deleting agreement");
  }
});
app.get("/api/allScholarData", async (req, res) => {
  try {
    // Fetch all documents from the Scholar model's collection, excluding the 'link' field
    const scholarData = await iPFile.find({}, { link: 0 }); // Exclude 'link' field
    res.json(scholarData);
  } catch (err) {
    console.error("Error fetching Scholar data:", err);
    res.status(500).send("Error fetching Scholar data");
  }
});
app.get("/api/allPublications", async (req, res) => {
  try {
    // Fetch all documents from the Scholar model's collection, excluding the 'link' field
    const scholarData = await pub.find({}, { link: 0 }); // Exclude 'link' field
    res.json(scholarData);
  } catch (err) {
    console.error("Error fetching Scholar data:", err);
    res.status(500).send("Error fetching Scholar data");
  }
});
app.get("/api/allGrantsData", async (req, res) => {
  try {
    // Fetch all documents from the Scholar model's collection, excluding the 'link' field
    const scholarData = await grants.find({}, { link: 0 }); // Exclude 'link' field
    res.json(scholarData);
  } catch (err) {
    console.error("Error fetching Scholar data:", err);
    res.status(500).send("Error fetching Scholar data");
  }
});

app.get("/api/ipDetails", async (req, res) => {
  try {
    const { researchGroup } = req.query; // Optional query parameter for filtering by research group
    const match = researchGroup ? { researchGroup } : {}; // Match condition if researchGroup is provided

    const ipDetails = await iPFile.aggregate([
      { $match: match }, // Filter by research group if provided
      {
        $unwind: "$intellectualProperties", // Decompose intellectualProperties array
      },
      {
        $group: {
          _id: {
            ipCategory: "$intellectualProperties.ipCategory",
            ipName: "$intellectualProperties.ipName",
          },
          totalIPs: { $sum: 1 }, // Count the number of IPs
        },
      },
      {
        $sort: { "_id.ipCategory": 1 }, // Sort by IP category
      },
    ]);

    const formattedData = ipDetails.map((entry) => ({
      ipCategory: entry._id.ipCategory,
      ipName: entry._id.ipName,
      totalIPs: entry.totalIPs,
    }));

    res.json(formattedData);
  } catch (err) {
    console.error("Error fetching IP details:", err);
    res.status(500).send("Error fetching IP details");
  }
});
//indexed,nonindexed pub
app.get("/api/detailed", async (req, res) => {
  try {
    const { researchGroup } = req.query;

    // Match the researchGroup exactly as it appears in the database
    const match = researchGroup
      ? { researchGroup } // No regex, direct match with the database value
      : {};

    // Aggregation pipeline
    const publicationData = await RG.aggregate([
      { $match: match },
      {
        $addFields: {
          INDEXED_PUBLICATION_INT: { $toInt: "$INDEXED_PUBLICATION" },
          NON_INDEXED_PUBLICATION_INT: { $toInt: "$NON_INDEXED_PUBLICATION" },
          OTHERS_PUBLICATION_INT: { $toInt: "$OTHERS_PUBLICATION" },
        },
      },
    ]);

    // Prepare details for each type of publication
    const indexedPublicationsDetails = publicationData.map((scholar) => ({
      name: scholar.name,
      researchGroup: scholar.researchGroup,
      publications: scholar.INDEXED_PUBLICATION_INT || 0,
    }));

    const nonIndexedPublicationsDetails = publicationData.map((scholar) => ({
      name: scholar.name,
      researchGroup: scholar.researchGroup,
      publications: scholar.NON_INDEXED_PUBLICATION_INT || 0,
    }));

    const otherPublicationsDetails = publicationData.map((scholar) => ({
      name: scholar.name,
      researchGroup: scholar.researchGroup,
      publications: scholar.OTHERS_PUBLICATION_INT || 0,
    }));

    // Calculate totals
    const totalIndexedPublications = indexedPublicationsDetails.reduce(
      (sum, scholar) => sum + scholar.publications,
      0
    );

    const totalNonIndexedPublications = nonIndexedPublicationsDetails.reduce(
      (sum, scholar) => sum + scholar.publications,
      0
    );

    const totalOtherPublications = otherPublicationsDetails.reduce(
      (sum, scholar) => sum + scholar.publications,
      0
    );

    // Return response with totals and details for all publication types
    res.json({
      indexedPublications: totalIndexedPublications,
      indexedDetails: indexedPublicationsDetails,
      nonIndexedPublications: totalNonIndexedPublications,
      nonIndexedDetails: nonIndexedPublicationsDetails,
      otherPublications: totalOtherPublications,
      otherDetails: otherPublicationsDetails,
    });
  } catch (err) {
    console.error("Error fetching detailed publication data:", err);
    res.status(500).send("Error fetching detailed publication data");
  }
});
//Grant
app.get("/api/detailedGrant", async (req, res) => {
  try {
    const { researchGroup } = req.query;

    // Match the researchGroup exactly as it appears in the database
    const match = researchGroup
      ? { researchGroup } // No regex, direct match with the database value
      : {};

    // Aggregation pipeline
    const grantData = await RG.aggregate([
      { $match: match },
      {
        $addFields: {
          NATIONAL_GRANTS_INT: { $toInt: "$NATIONAL_GRANTS" },
          INTERNATIONAL_GRANTS_INT: { $toInt: "$INTERNATIONAL_GRANTS" },
          INDUSTRY_GRANTS_INT: { $toInt: "$INDUSTRY_GRANTS" },
          UNIVERSITY_FUND_INT: { $toInt: "$UNIVERSITY_FUND" },
        },
      },
    ]);

    // Prepare details for each type of grant
    const nationalGrantDetails = grantData.map((scholar) => ({
      name: scholar.name,
      researchGroup: scholar.researchGroup,
      grants: scholar.NATIONAL_GRANTS_INT || 0,
    }));

    const internationalGrantDetails = grantData.map((scholar) => ({
      name: scholar.name,
      researchGroup: scholar.researchGroup,
      grants: scholar.INTERNATIONAL_GRANTS_INT || 0,
    }));

    const industryGrantDetails = grantData.map((scholar) => ({
      name: scholar.name,
      researchGroup: scholar.researchGroup,
      grants: scholar.INDUSTRY_GRANTS_INT || 0,
    }));

    const universityFundDetails = grantData.map((scholar) => ({
      name: scholar.name,
      researchGroup: scholar.researchGroup,
      grants: scholar.UNIVERSITY_FUND_INT || 0,
    }));

    // Calculate totals for each type of grant
    const totalNationalGrants = nationalGrantDetails.reduce(
      (sum, scholar) => sum + scholar.grants,
      0
    );

    const totalInternationalGrants = internationalGrantDetails.reduce(
      (sum, scholar) => sum + scholar.grants,
      0
    );

    const totalIndustryGrants = industryGrantDetails.reduce(
      (sum, scholar) => sum + scholar.grants,
      0
    );

    const totalUniversityFunds = universityFundDetails.reduce(
      (sum, scholar) => sum + scholar.grants,
      0
    );

    // Return response with totals and details for all grant types
    res.json({
      totalNationalGrants,
      nationalGrantDetails,
      totalInternationalGrants,
      internationalGrantDetails,
      totalIndustryGrants,
      industryGrantDetails,
      totalUniversityFunds,
      universityFundDetails,
    });
  } catch (err) {
    console.error("Error fetching detailed grant data:", err);
    res.status(500).send("Error fetching detailed grant data");
  }
});

app.get("/api/grantsByYear", async (req, res) => {
  try {
    const { researchGroup } = req.query; // Optional query parameter for filtering by research group
    const match = researchGroup ? { researchGroup } : {}; // Match condition if researchGroup is provided

    const grantsData = await grants.aggregate([
      { $match: match }, // Filter by research group if provided
      {
        $unwind: "$grants", // Decompose grants array
      },
      {
        $group: {
          _id: { year: "$grants.year", researchGroup: "$researchGroup" },
          totalGrants: { $sum: 1 }, // Count the number of grants
        },
      },
      {
        $sort: { "_id.year": 1 }, // Sort by year
      },
    ]);

    const formattedData = grantsData.map((entry) => ({
      year: entry._id.year,
      researchGroup: entry._id.researchGroup,
      totalGrants: entry.totalGrants,
    }));

    res.json(formattedData);
  } catch (err) {
    console.error("Error fetching grants data by year:", err);
    res.status(500).send("Error fetching grants data by year");
  }
});
// app.post("/login", loginController.login);
app.get("/api/totalStaff", async (req, res) => {
  try {
    const totalStaff = await RG.countDocuments({ link: { $exists: true } });
    res.json({ totalStaff });
  } catch (err) {
    console.error("Error fetching total staff:", err);
    res.status(500).send("Error fetching total staff");
  }
});
// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// import React, { useEffect, useState } from "react";
// import { ResponsivePie } from "@nivo/pie";

// const HIndexCitationsPublicationsPieChart = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchScopusData = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/scopusData");
//         if (!response.ok) throw new Error(`Error: ${response.statusText}`);
//         const jsonData = await response.json();

//         // Prepare the data for the pie chart
//         const chartData = [
//           { id: "H-Index", value: jsonData.hIndexedScopus },
//           { id: "Citations", value: jsonData.citationsScopus },
//           { id: "Publications", value: jsonData.publications },
//         ];

//         // Calculate total for percentage labels
//         const total = chartData.reduce((sum, entry) => sum + entry.value, 0);

//         // Add percentage labels
//         const dataWithPercentage = chartData.map((item) => ({
//           ...item,
//           label: `${((item.value / total) * 100).toFixed(1)}%`,
//         }));

//         setData(dataWithPercentage);
//       } catch (err) {
//         console.error("Error fetching Scopus data:", err);
//         setError("Failed to load chart data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchScopusData();
//   }, []);

//   if (loading) return <p>Loading chart...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div style={{ height: "400px", width: "800px", margin: "auto" }}>
//       <ResponsivePie
//         data={data}
//         margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
//         innerRadius={0} // Full pie chart
//         padAngle={1} // Spacing between slices
//         cornerRadius={3}
//         colors={{ scheme: "set2" }} // Bright color scheme
//         borderWidth={1}
//         borderColor={{
//           from: "color",
//           modifiers: [["darker", 0.2]],
//         }}
//         arcLinkLabelsSkipAngle={10}
//         arcLinkLabelsTextColor="#333333"
//         arcLinkLabelsThickness={2}
//         arcLinkLabelsColor={{ from: "color" }}
//         arcLabelsSkipAngle={10}
//         arcLabelsTextColor={{
//           from: "color",
//           modifiers: [["darker", 2]],
//         }}
//         tooltip={({ datum }) => (
//           <div
//             style={{
//               padding: "5px 10px",
//               color: "white",
//               background: datum.color,
//               borderRadius: "3px",
//             }}
//           >
//             <strong>{datum.id}</strong>: {datum.value} ({datum.label})
//           </div>
//         )}
//         legends={[
//           {
//             anchor: "bottom",
//             direction: "row",
//             justify: false,
//             translateX: 0,
//             translateY: 56,
//             itemsSpacing: 0,
//             itemWidth: 100,
//             itemHeight: 18,
//             itemTextColor: "#999",
//             itemDirection: "left-to-right",
//             symbolSize: 18,
//             symbolShape: "circle",
//             effects: [
//               {
//                 on: "hover",
//                 style: {
//                   itemTextColor: "#000",
//                 },
//               },
//             ],
//           },
//         ]}
//       />
//     </div>
//   );
// };

// export default HIndexCitationsPublicationsPieChart;
