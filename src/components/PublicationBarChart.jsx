// import React from "react";
// import { ResponsiveBar } from "@nivo/bar";
// import scholarData from "../data/scraped_scholar_data.json"; // Adjust the path as necessary

// const PublicationsBarChart = () => {
//   // Calculate totals for Indexed, Non-Indexed, and Others Publications
//   const totalIndexed = scholarData.reduce(
//     (sum, entry) => sum + (entry["INDEXED PUBLICATION"] || 0),
//     0
//   );
//   const totalNonIndexed = scholarData.reduce(
//     (sum, entry) => sum + (entry["NON-INDEXED PUBLICATION"] || 0),
//     0
//   );
//   const totalOthers = scholarData.reduce(
//     (sum, entry) => sum + (entry["OTHERS PUBLICATION"] || 0),
//     0
//   );

//   // Prepare data for the bar chart
//   const data = [
//     { type: "Indexed Publications", count: totalIndexed },
//     { type: "Non-Indexed Publications", count: totalNonIndexed },
//     { type: "Others Publications", count: totalOthers },
//   ];

//   return (
//     <div style={{ height: "100%", width: "100%", margin: "auto" }}>
//       <h2 style={{ textAlign: "center" }}>Publications Overview</h2>
//       <ResponsiveBar
//         data={data}
//         keys={["count"]}
//         indexBy="type"
//         margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
//         padding={0.3}
//         colors={{ scheme: "set2" }}
//         borderColor={{
//           from: "color",
//           modifiers: [["darker", 1.6]],
//         }}
//         axisTop={null}
//         axisRight={null}
//         axisBottom={{
//           tickSize: 5,
//           tickPadding: 5,
//           tickRotation: 0,
//           legend: "Publication Type",
//           legendPosition: "middle",
//           legendOffset: 32,
//         }}
//         axisLeft={{
//           tickSize: 5,
//           tickPadding: 5,
//           tickRotation: 0,
//           legend: "Count",
//           legendPosition: "middle",
//           legendOffset: -40,
//         }}
//         labelSkipWidth={12}
//         labelSkipHeight={12}
//         labelTextColor={{
//           from: "color",
//           modifiers: [["darker", 1.6]],
//         }}
//         role="application"
//         ariaLabel="Bar chart of publications"
//       />
//     </div>
//   );
// };

// export default PublicationsBarChart;

// import React, { useEffect, useState } from "react";
// import { ResponsiveBar } from "@nivo/bar";

// const PublicationsBarChart = () => {
//   const [data, setData] = useState([]);
//   const [researchGroups, setResearchGroups] = useState([]);
//   const [selectedGroup, setSelectedGroup] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch research groups on component mount
//   useEffect(() => {
//     const fetchResearchGroups = async () => {
//       try {
//         const response = await fetch(
//           "http://localhost:5000/api/research-groups"
//         );
//         if (!response.ok) throw new Error(`Error: ${response.statusText}`);
//         const groups = await response.json();
//         setResearchGroups(groups);
//       } catch (err) {
//         console.error("Error fetching research groups:", err);
//         setError("Failed to load research groups.");
//       }
//     };

//     fetchResearchGroups();
//   }, []);

//   // Fetch publications data based on selected research group
//   useEffect(() => {
//     const fetchPublicationsData = async () => {
//       try {
//         setLoading(true);
//         const url = selectedGroup
//           ? `http://localhost:5000/api/publications?researchGroup=${encodeURIComponent(
//               selectedGroup
//             )}`
//           : "http://localhost:5000/api/publications";

//         const response = await fetch(url);
//         if (!response.ok) throw new Error(`Error: ${response.statusText}`);
//         const jsonData = await response.json();

//         // Map API response to chart data format
//         const chartData = [
//           { type: "Indexed Publications", count: jsonData.indexedPublications },
//           {
//             type: "Non-Indexed Publications",
//             count: jsonData.nonIndexedPublications,
//           },
//           { type: "Others Publications", count: jsonData.otherPublications },
//         ];
//         setData(chartData);
//       } catch (err) {
//         console.error("Error fetching publications data:", err);
//         setError("Failed to load chart data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPublicationsData();
//   }, [selectedGroup]);

//   if (loading) return <p>Loading chart...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div style={{ height: "500px", width: "700px", margin: "auto" }}>
//       <h2 style={{ textAlign: "center" }}>Publications Overview</h2>
//       <div style={{ textAlign: "center", marginBottom: "20px" }}>
//         <label htmlFor="researchGroup">Filter by Research Group: </label>
//         <select
//           id="researchGroup"
//           value={selectedGroup}
//           onChange={(e) => setSelectedGroup(e.target.value)}
//         >
//           <option value="">All Research Groups</option>
//           {researchGroups.map((group) => (
//             <option key={group} value={group}>
//               {group}
//             </option>
//           ))}
//         </select>
//       </div>
//       <ResponsiveBar
//         data={data}
//         keys={["count"]}
//         indexBy="type"
//         margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
//         padding={0.3}
//         colors={{ scheme: "set2" }}
//         borderColor={{
//           from: "color",
//           modifiers: [["darker", 1.6]],
//         }}
//         axisTop={null}
//         axisRight={null}
//         axisBottom={{
//           tickSize: 5,
//           tickPadding: 5,
//           tickRotation: 0,
//           legend: "Publication Type",
//           legendPosition: "middle",
//           legendOffset: 32,
//         }}
//         axisLeft={{
//           tickSize: 5,
//           tickPadding: 5,
//           tickRotation: 0,
//           legend: "Count",
//           legendPosition: "middle",
//           legendOffset: -40,
//         }}
//         labelSkipWidth={12}
//         labelSkipHeight={12}
//         labelTextColor={{
//           from: "color",
//           modifiers: [["darker", 1.6]],
//         }}
//         role="application"
//         ariaLabel="Bar chart of publications"
//       />
//     </div>
//   );
// };

// export default PublicationsBarChart;

import React, { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";

const PublicationBarChart = () => {
  const [researchGroups, setResearchGroups] = useState([]); // Research groups
  const [selectedGroup, setSelectedGroup] = useState("All Research Groups"); // Selected research group
  const [data, setData] = useState(null); // API response
  const [chartData, setChartData] = useState([]); // Bar chart data
  const [tableData, setTableData] = useState([]); // Table data
  const [currentPage, setCurrentPage] = useState(0); // Current page for pagination
  const itemsPerPage = 10; // Rows per page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTable, setShowTable] = useState(false); // State to toggle table visibility

  // Fetch research groups on mount
  useEffect(() => {
    const fetchResearchGroups = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/research-groups"
        );
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const groups = await response.json();
        const filteredGroups = groups.filter((group) => group !== "N/A"); // Exclude "N/A"
        setResearchGroups(["All Research Groups", ...filteredGroups]);
        setSelectedGroup("All Research Groups");
      } catch (err) {
        console.error("Error fetching research groups:", err);
        setError("Failed to load research groups.");
      }
    };

    fetchResearchGroups();
  }, []);

  // Fetch publication data when a group is selected
  useEffect(() => {
    const fetchPublicationData = async () => {
      try {
        setLoading(true);
        const query =
          selectedGroup !== "All Research Groups"
            ? `?researchGroup=${encodeURIComponent(selectedGroup)}`
            : "";
        const response = await fetch(
          `http://localhost:5000/api/detailed${query}`
        );
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const jsonData = await response.json();
        setData(jsonData);

        setChartData([
          { category: "Indexed", count: jsonData.indexedPublications },
          { category: "Non-Indexed", count: jsonData.nonIndexedPublications },
          { category: "Other", count: jsonData.otherPublications },
        ]);
      } catch (err) {
        console.error("Error fetching publication data:", err);
        setError("Failed to load chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicationData();
  }, [selectedGroup]);

  // Handle bar click
  const handleBarClick = (bar) => {
    if (!data) return;

    let details = [];
    if (bar.data.category === "Indexed") {
      details = data.indexedDetails;
    } else if (bar.data.category === "Non-Indexed") {
      details = data.nonIndexedDetails;
    } else {
      details = data.otherDetails;
    }

    setTableData(details.filter((item) => item.publications > 0));
    setCurrentPage(0);
    setShowTable(true); // Show the table on bar click
  };

  // Handle pagination
  const displayedTableData = tableData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = (direction) => {
    if (
      direction === "next" &&
      (currentPage + 1) * itemsPerPage < tableData.length
    ) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (error) return <p>{error}</p>;
  if (loading) return <p>Loading chart...</p>;

  return (
    <div style={{ height: "500px", width: "700px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Publications Overview</h2>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <label htmlFor="researchGroup">Filter by Research Group: </label>
        <select
          id="researchGroup"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          style={{
            padding: "8px 12px",
            fontSize: "14px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            minWidth: "250px",
          }}
        >
          {/* <option value="">All Research Groups</option> */}
          {researchGroups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveBar
        data={chartData}
        keys={["count"]}
        indexBy="category"
        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
        padding={0.3}
        colors={{ scheme: "set2" }}
        borderColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Publication Type",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Count",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        onClick={handleBarClick}
        role="application"
        ariaLabel="Bar chart of publications"
      />
      {showTable && tableData.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3 style={{ textAlign: "center" }}>Details</h3>
          <button
            onClick={() => setShowTable(false)}
            style={{
              display: "block",
              margin: "10px auto",
              padding: "8px 12px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Close Table
          </button>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f4f4f4" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Name
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Research Group
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  No.
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedTableData.map((item, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                  }}
                >
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {item.name}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {item.researchGroup}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {item.publications}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 0}
              style={{
                padding: "5px 10px",
                marginRight: "10px",
                cursor: "pointer",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange("next")}
              disabled={(currentPage + 1) * itemsPerPage >= tableData.length}
              style={{
                padding: "5px 10px",
                cursor: "pointer",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicationBarChart;
