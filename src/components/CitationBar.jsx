// import React from "react";
// import { ResponsiveBar } from "@nivo/bar";
// import scholarData from "../data/scraped_scholar_data.json"; // Adjust the path as necessary

// const HIndexCitationsBarChart = () => {
//   // Calculate totals for H-index and Citations
//   const totalHIndex = scholarData.reduce(
//     (sum, entry) => sum + (entry["H-INDEXED (SCOPUS)"] || 0),
//     0
//   );
//   const totalCitations = scholarData.reduce(
//     (sum, entry) => sum + (entry["CITATIONS (SCOPUS)"] || 0),
//     0
//   );

//   // Prepare data for the bar chart
//   const data = [
//     { type: "H-Index", count: totalHIndex },
//     { type: "Citations", count: totalCitations },
//   ];

//   return (
//     <div style={{ height: "80%", width: "100%", margin: "auto" }}>
//       <h2 style={{ textAlign: "center" }}>H-Index and Citations Overview</h2>
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
//           legend: "Metric Type",
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
//         ariaLabel="Bar chart of H-index and citations"
//       />
//     </div>
//   );
// };

// export default HIndexCitationsBarChart;

// import React from "react";
// import { ResponsiveBar } from "@nivo/bar";
// import scholarData from "../data/scraped_scholar_data.json"; // Adjust the path as necessary

// const StackedBarChart = () => {
//   // Prepare the data for the stacked bar chart
//   const data = scholarData.map((scholar, index) => ({
//     scholar: index + 1, // Use scholar number (1 to 100)
//     hIndex: scholar["H-INDEXED (SCOPUS)"] || 0,
//     citations: scholar["CITATIONS (SCOPUS)"] || 0,
//     publications: scholar["PUBLICATIONS"] || 0,
//   }));

//   return (
//     <div style={{ height: "90%", width: "100%", margin: "auto" }}>
//       <h2 style={{ textAlign: "center" }}>
//         Metrics Comparison Across Scholars
//       </h2>
//       <ResponsiveBar
//         data={data}
//         keys={["hIndex", "citations", "publications"]} // Metrics to stack
//         indexBy="scholar" // Use scholar numbers as x-axis
//         margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
//         padding={0.3}
//         groupMode="stacked" // Enables stacked bars
//         colors={{ scheme: "set2" }} // Bright color scheme
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
//           legend: "Scholars (1-100)",
//           legendPosition: "middle",
//           legendOffset: 32,
//           tickValues: Array.from({ length: 20 }, (_, i) => i * 5 + 1), // Gap of 5
//         }}
//         axisLeft={{
//           tickSize: 5,
//           tickPadding: 5,
//           tickRotation: 0,
//           legend: "Metrics",
//           legendPosition: "middle",
//           legendOffset: -40,
//         }}
//         labelSkipWidth={12}
//         labelSkipHeight={12}
//         labelTextColor={{
//           from: "color",
//           modifiers: [["darker", 1.6]],
//         }}
//         tooltip={({ id, value }) => (
//           <div
//             style={{
//               padding: "5px 10px",
//               color: "white",
//               background: "#333",
//               borderRadius: "3px",
//             }}
//           >
//             <strong>{id}</strong>: {value}
//           </div>
//         )}
//         legends={[
//           {
//             dataFrom: "keys",
//             anchor: "bottom-right",
//             direction: "column",
//             justify: false,
//             translateX: 120,
//             translateY: 0,
//             itemsSpacing: 2,
//             itemWidth: 100,
//             itemHeight: 20,
//             itemDirection: "left-to-right",
//             itemOpacity: 0.85,
//             symbolSize: 20,
//             effects: [
//               {
//                 on: "hover",
//                 style: {
//                   itemOpacity: 1,
//                 },
//               },
//             ],
//           },
//         ]}
//         role="application"
//         ariaLabel="Stacked bar chart for scholar metrics"
//       />
//     </div>
//   );
// };

// export default StackedBarChart;

// import React, { useEffect, useState } from "react";
// import { ResponsiveBar } from "@nivo/bar";

// const StackedBarChart = () => {
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

//   // Fetch Scopus data based on selected research group
//   useEffect(() => {
//     const fetchScopusData = async () => {
//       try {
//         setLoading(true);
//         const url = selectedGroup
//           ? `http://localhost:5000/api/scopusData?researchGroup=${encodeURIComponent(
//               selectedGroup
//             )}`
//           : "http://localhost:5000/api/scopusData";

//         const response = await fetch(url);
//         if (!response.ok) throw new Error(`Error: ${response.statusText}`);
//         const jsonData = await response.json();

//         // Prepare data for the bar chart
//         const chartData = [
//           {
//             metric: "H-Index",
//             count: jsonData.hIndexedScopus,
//             color: "#A1CFFF", // Light blue
//           },
//           {
//             metric: "Citations",
//             count: jsonData.citationsScopus,
//             color: "#FFC9A9", // Light orange
//           },
//           {
//             metric: "Publications",
//             count: jsonData.publications,
//             color: "#A4EDC2", // Light green
//           },
//         ];

//         setData(chartData);
//       } catch (err) {
//         console.error("Error fetching Scopus data:", err);
//         setError("Failed to load chart data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchScopusData();
//   }, [selectedGroup]);

//   if (loading) return <p>Loading chart...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div style={{ margin: "auto", textAlign: "center" }}>
//       <div style={{ marginBottom: "20px" }}>
//         <label htmlFor="researchGroup" style={{ marginRight: "10px" }}>
//           Filter by Research Group:
//         </label>
//         <select
//           id="researchGroup"
//           value={selectedGroup}
//           onChange={(e) => setSelectedGroup(e.target.value)}
//           style={{
//             padding: "8px",
//             borderRadius: "4px",
//             border: "1px solid #ccc",
//             fontSize: "14px",
//           }}
//         >
//           <option value="">All Research Groups</option>
//           {researchGroups.map((group) => (
//             <option key={group} value={group}>
//               {group}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div style={{ height: "500px", width: "80%", margin: "auto" }}>
//         <h2>Metrics Overview</h2>
//         <ResponsiveBar
//           data={data}
//           keys={["count"]}
//           indexBy="metric"
//           margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
//           padding={0.3}
//           colors={({ data }) => data.color}
//           borderColor={{
//             from: "color",
//             modifiers: [["darker", 0.6]],
//           }}
//           axisTop={null}
//           axisRight={null}
//           axisBottom={{
//             tickSize: 5,
//             tickPadding: 5,
//             tickRotation: 0,
//             legend: "Metric Type",
//             legendPosition: "middle",
//             legendOffset: 40,
//           }}
//           axisLeft={{
//             tickSize: 5,
//             tickPadding: 5,
//             tickRotation: 0,
//             legend: "Count",
//             legendPosition: "middle",
//             legendOffset: -40,
//           }}
//           label={({ value }) => value}
//           labelSkipWidth={16}
//           labelSkipHeight={16}
//           labelTextColor="black"
//           tooltip={({ id, value, color }) => (
//             <div
//               style={{
//                 padding: "5px 10px",
//                 color: "white",
//                 background: color,
//                 borderRadius: "3px",
//               }}
//             >
//               <strong>{id}</strong>: {value}
//             </div>
//           )}
//           legends={[
//             {
//               dataFrom: "keys",
//               anchor: "bottom",
//               direction: "row",
//               justify: false,
//               translateX: 0,
//               translateY: 50,
//               itemsSpacing: 10,
//               itemWidth: 100,
//               itemHeight: 18,
//               itemTextColor: "#999",
//               itemDirection: "left-to-right",
//               symbolSize: 18,
//               symbolShape: "circle",
//               effects: [
//                 {
//                   on: "hover",
//                   style: {
//                     itemTextColor: "#000",
//                   },
//                 },
//               ],
//             },
//           ]}
//           role="application"
//           ariaLabel="Bar chart showing metrics overview"
//         />
//       </div>

//       {/* Add the summary below the chart */}
//       <div
//         style={{
//           marginTop: "30px",
//           display: "flex",
//           justifyContent: "center",
//           gap: "20px",
//         }}
//       >
//         <p>
//           <strong>H-Index (Scopus):</strong>{" "}
//           {data.find((d) => d.metric === "H-Index")?.count || 0}
//         </p>
//         <p>
//           <strong>Publications:</strong>{" "}
//           {data.find((d) => d.metric === "Publications")?.count || 0}
//         </p>
//         <p>
//           <strong>Citations (Scopus):</strong>{" "}
//           {data.find((d) => d.metric === "Citations")?.count || 0}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default StackedBarChart;

// import React, { useEffect, useState } from "react";
// import { ResponsiveBar } from "@nivo/bar";

// const HIndexBarChart = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchHIndexData = async () => {
//       try {
//         const response = await fetch(
//           "http://localhost:5000/api/hIndexScopusByResearchGroup"
//         );
//         if (!response.ok) throw new Error(`Error: ${response.statusText}`);
//         const jsonData = await response.json();

//         // Filter out invalid data (N/A research groups)
//         const filteredData = jsonData
//           .filter((item) => item.researchGroup !== "N/A")
//           .map((item) => ({
//             ...item,
//             researchGroup:
//               item.researchGroup.match(/\(([^)]+)\)/)?.[1] ||
//               item.researchGroup, // Extract short form
//           }));

//         setData(filteredData);
//       } catch (err) {
//         console.error("Error fetching H-index data:", err);
//         setError("Failed to load data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHIndexData();
//   }, []);

//   if (loading) return <p>Loading chart...</p>;
//   if (error) return <p>{error}</p>;

//   // Generate unique colors for bars
//   const colors = [
//     "#FFB6C1", // Light Pink
//     "#FFD700", // Gold
//     "#87CEFA", // Light Blue
//     "#32CD32", // Lime Green
//     "#FFA07A", // Light Salmon
//     "#9370DB", // Medium Purple
//     "#FF6347", // Tomato
//     "#40E0D0", // Turquoise
//   ];

//   return (
//     <div style={{ margin: "auto", textAlign: "center", width: "80%" }}>
//       <h2>H-index (Scopus) by Research Group</h2>
//       <div style={{ height: "500px" }}>
//         <ResponsiveBar
//           data={data}
//           keys={["hIndexScopus"]}
//           indexBy="researchGroup"
//           margin={{ top: 50, right: 50, bottom: 100, left: 60 }}
//           padding={0.3}
//           colors={(bar) => colors[bar.index % colors.length]} // Assign unique color to each bar
//           borderColor={{
//             from: "color",
//             modifiers: [["darker", 1.6]],
//           }}
//           axisTop={null}
//           axisRight={null}
//           axisBottom={{
//             tickSize: 5,
//             tickPadding: 5,
//             tickRotation: 0, // Keep labels straight
//             legend: "Research Group",
//             legendPosition: "middle",
//             legendOffset: 70,
//           }}
//           axisLeft={{
//             tickSize: 5,
//             tickPadding: 5,
//             tickRotation: 0,
//             legend: "H-index Scopus",
//             legendPosition: "middle",
//             legendOffset: -50,
//           }}
//           labelSkipWidth={12}
//           labelSkipHeight={12}
//           labelTextColor={{
//             from: "color",
//             modifiers: [["darker", 1.6]],
//           }}
//           tooltip={({ id, value, indexValue }) => (
//             <div
//               style={{
//                 padding: "5px",
//                 background: "#fff",
//                 border: "1px solid #ccc",
//                 borderRadius: "3px",
//               }}
//             >
//               <strong>
//                 {indexValue}: {value}
//               </strong>
//             </div>
//           )}
//           legends={[
//             {
//               dataFrom: "keys",
//               anchor: "bottom-right",
//               direction: "row",
//               justify: false,
//               translateX: 0,
//               translateY: 50,
//               itemsSpacing: 5,
//               itemWidth: 100,
//               itemHeight: 20,
//               itemDirection: "left-to-right",
//               itemOpacity: 0.85,
//               symbolSize: 20,
//               effects: [
//                 {
//                   on: "hover",
//                   style: {
//                     itemOpacity: 1,
//                   },
//                 },
//               ],
//             },
//           ]}
//           role="application"
//           ariaLabel="Bar chart showing H-index (Scopus) by research groups"
//         />
//       </div>
//       <div style={{ marginTop: "20px", paddingBottom: "30px" }}>
//         <h3>Insights</h3>
//         <p>
//           The research group with the highest H-index (Scopus) is{" "}
//           <strong>
//             {
//               data.reduce((max, group) =>
//                 group.hIndexScopus > max.hIndexScopus ? group : max
//               ).researchGroup
//             }
//           </strong>{" "}
//           with a value of{" "}
//           <strong>
//             {
//               data.reduce((max, group) =>
//                 group.hIndexScopus > max.hIndexScopus ? group : max
//               ).hIndexScopus
//             }
//           </strong>
//           . The total H-index (Scopus) across all groups is{" "}
//           <strong>
//             {data.reduce((sum, group) => sum + group.hIndexScopus, 0)}
//           </strong>
//           .
//         </p>
//       </div>
//     </div>
//   );
// };

// export default HIndexBarChart;

import React, { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";

const HIndexBarChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null); // Track the selected research group

  useEffect(() => {
    const fetchHIndexData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/hIndexScopusByResearchGroup"
        );
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const jsonData = await response.json();

        // Filter out invalid data (N/A research groups or hIndexScopus <= 0)
        const filteredData = jsonData
          .filter(
            (item) =>
              item.researchGroup !== "N/A" &&
              item.hIndexScopus > 0 &&
              item.hIndexScopus !== null
          )
          .map((item) => ({
            ...item,
            researchGroup:
              item.researchGroup.match(/\(([^)]+)\)/)?.[1] ||
              item.researchGroup, // Extract short form
            scholars: item.scholars?.filter(
              (scholar) =>
                scholar.hIndexScopus > 0 &&
                scholar.name !== "N/A" &&
                scholar.name !== null
            ), // Filter scholars as well
          }));

        setData(filteredData);
      } catch (err) {
        console.error("Error fetching H-index data:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchHIndexData();
  }, []);

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>{error}</p>;

  // Generate unique colors for bars
  const colors = [
    "#FFB6C1", // Light Pink
    "#FFD700", // Gold
    "#87CEFA", // Light Blue
    "#32CD32", // Lime Green
    "#FFA07A", // Light Salmon
    "#9370DB", // Medium Purple
    "#FF6347", // Tomato
    "#40E0D0", // Turquoise
  ];

  return (
    <div style={{ margin: "auto", textAlign: "center", width: "80%" }}>
      <h2>H-index (Scopus) by Research Group</h2>
      <div style={{ height: "500px" }}>
        <ResponsiveBar
          data={data}
          keys={["hIndexScopus"]}
          indexBy="researchGroup"
          margin={{ top: 50, right: 50, bottom: 100, left: 60 }}
          padding={0.3}
          colors={(bar) => colors[bar.index % colors.length]} // Assign unique color to each bar
          borderColor={{
            from: "color",
            modifiers: [["darker", 1.6]],
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0, // Keep labels straight
            legend: "Research Group",
            legendPosition: "middle",
            legendOffset: 70,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "H-index Scopus",
            legendPosition: "middle",
            legendOffset: -50,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{
            from: "color",
            modifiers: [["darker", 1.6]],
          }}
          tooltip={({ id, value, indexValue }) => (
            <div
              style={{
                padding: "5px",
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "3px",
              }}
            >
              <strong>
                {indexValue}: {value}
              </strong>
            </div>
          )}
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom-right",
              direction: "row",
              justify: false,
              translateX: 0,
              translateY: 50,
              itemsSpacing: 5,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: "left-to-right",
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: "hover",
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          onClick={(bar) => {
            // On bar click, find the corresponding group and set it as selected
            const clickedGroup = data.find(
              (group) => group.researchGroup === bar.indexValue
            );
            setSelectedGroup(clickedGroup);
          }}
          role="application"
          ariaLabel="Bar chart showing H-index (Scopus) by research groups"
        />
      </div>

      {/* Insights Section */}
      <div style={{ marginTop: "20px", paddingBottom: "30px" }}>
        <h3>Insights</h3>
        <p>
          The research group with the highest H-index (Scopus) is{" "}
          <strong>
            {
              data.reduce((max, group) =>
                group.hIndexScopus > max.hIndexScopus ? group : max
              ).researchGroup
            }
          </strong>{" "}
          with a value of{" "}
          <strong>
            {
              data.reduce((max, group) =>
                group.hIndexScopus > max.hIndexScopus ? group : max
              ).hIndexScopus
            }
          </strong>
          . The total H-index (Scopus) across all groups is{" "}
          <strong>
            {data.reduce((sum, group) => sum + group.hIndexScopus, 0)}
          </strong>
          .
        </p>
      </div>

      {/* Display Table Below */}
      {selectedGroup && (
        <div style={{ marginTop: "30px", paddingBottom: "30px" }}>
          <h3>Details</h3>
          <button
            onClick={() => setSelectedGroup(null)} // Close the table
            style={{
              marginBottom: "15px",
              padding: "10px 20px",
              backgroundColor: "#FF6347",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Close Table
          </button>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              margin: "auto",
              textAlign: "left",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  Research Group
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  H-index (Scopus)
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedGroup.scholars.map((scholar, index) => (
                <tr key={index}>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    {scholar.name}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    {selectedGroup.researchGroup}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    {scholar.hIndexScopus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HIndexBarChart;
