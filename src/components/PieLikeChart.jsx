// import { ResponsivePie } from "@nivo/pie";
// import scholarData from "../data/scraped_scholar_data.json";

// const HIndexCitationsPublicationsPieChart = () => {
//   // Prepare the data for the pie chart
//   const data = [
//     {
//       id: "H-Index",
//       value: scholarData.reduce(
//         (sum, item) => sum + (item["H-INDEXED (SCOPUS)"] || 0),
//         0
//       ),
//     },
//     {
//       id: "Citations",
//       value: scholarData.reduce(
//         (sum, item) => sum + (item["CITATIONS (SCOPUS)"] || 0),
//         0
//       ),
//     },
//     {
//       id: "Publications",
//       value: scholarData.reduce(
//         (sum, item) => sum + (item["PUBLICATIONS"] || 0),
//         0
//       ),
//     },
//   ];

//   // Calculate the total for percentage calculation
//   const total = data.reduce((sum, entry) => sum + entry.value, 0);

//   // Add percentage labels
//   const dataWithPercentage = data.map((item) => ({
//     ...item,
//     label: `${((item.value / total) * 100).toFixed(1)}%`,
//   }));

//   return (
//     <div style={{ height: "400px", width: "800px", margin: "auto" }}>
//       <ResponsivePie
//         data={dataWithPercentage}
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

// import React, { useEffect, useState } from "react";
// import { ResponsivePie } from "@nivo/pie";

// const HIndexCitationsPublicationsPieChart = () => {
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
//   }, [selectedGroup]);

//   if (loading) return <p>Loading chart...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div
//       style={{
//         height: "500px",
//         width: "700px",
//         margin: "auto",
//         textAlign: "center",
//       }}
//     >
//       <h2 style={{ marginBottom: "20px" }}>
//         H-Index, Citations, and Publications Overview
//       </h2>
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
//       <ResponsivePie
//         data={data}
//         margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
//         innerRadius={0.6} // Doughnut-style chart
//         padAngle={1} // Spacing between slices
//         cornerRadius={5} // Rounded corners for slices
//         colors={{ scheme: "category10" }} // Improved color scheme
//         borderWidth={2}
//         borderColor={{
//           from: "color",
//           modifiers: [["darker", 0.6]],
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
//               color: "#fff",
//               background: datum.color,
//               borderRadius: "5px",
//               fontSize: "12px",
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
//             itemWidth: 120,
//             itemHeight: 18,
//             itemTextColor: "#333",
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

// import React, { useEffect, useState } from "react";
// import { ResponsiveBar } from "@nivo/bar";

// const CitationsScopusChart = () => {
//   const [data, setData] = useState([]); // Data from API
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(
//           "http://localhost:5000/api/citationsScopusByResearchGroup"
//         );
//         if (!response.ok) throw new Error(`Error: ${response.statusText}`);
//         const jsonData = await response.json();

//         // Process data: Exclude invalid entries (e.g., N/A) and set data for the chart
//         const processedData = jsonData
//           .filter((item) => item.researchGroup !== "N/A") // Exclude invalid data
//           .map((item) => ({
//             researchGroup: getShortName(item.researchGroup), // Convert to short name
//             citationsScopus: item.citationsScopus,
//           }));
//         setData(processedData);
//       } catch (err) {
//         console.error("Error fetching citations data:", err);
//         setError("Failed to load chart data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Helper function to extract short names
//   const getShortName = (fullName) => {
//     const match = fullName.match(/\(([^)]+)\)/); // Extract content within parentheses
//     return match ? match[1] : fullName; // Return short form or original name
//   };

//   if (loading) return <p>Loading chart...</p>;
//   if (error) return <p>{error}</p>;

//   // Colors for bars
//   const colors = [
//     "#8dd3c7",
//     "#ffffb3",
//     "#bebada",
//     "#fb8072",
//     "#80b1d3",
//     "#fdb462",
//     "#b3de69",
//   ];

//   return (
//     <div style={{ width: "80%", margin: "auto", textAlign: "center" }}>
//       <h2>Citations (Scopus) by Research Group</h2>
//       <div style={{ height: "500px" }}>
//         <ResponsiveBar
//           data={data}
//           keys={["citationsScopus"]}
//           indexBy="researchGroup"
//           margin={{ top: 50, right: 50, bottom: 100, left: 60 }}
//           padding={0.3}
//           colors={({ index }) => colors[index % colors.length]} // Unique colors for bars
//           borderColor={{
//             from: "color",
//             modifiers: [["darker", 1.6]],
//           }}
//           axisTop={null}
//           axisRight={null}
//           axisBottom={{
//             tickSize: 5,
//             tickPadding: 5,
//             tickRotation: 0, // Straight labels
//             legend: "Research Group",
//             legendPosition: "middle",
//             legendOffset: 60,
//           }}
//           axisLeft={{
//             tickSize: 5,
//             tickPadding: 5,
//             tickRotation: 0,
//             legend: "Citations (Scopus)",
//             legendPosition: "middle",
//             legendOffset: -50,
//           }}
//           labelSkipWidth={16}
//           labelSkipHeight={16}
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
//               <strong>{indexValue}</strong>: {value}
//             </div>
//           )}
//           legends={[
//             {
//               dataFrom: "keys",
//               anchor: "bottom-right",
//               direction: "column",
//               justify: false,
//               translateX: 120,
//               translateY: 0,
//               itemsSpacing: 2,
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
//         />
//       </div>
//       <div
//         style={{
//           marginTop: "20px",
//           paddingBottom: "30px",
//           textAlign: "center",
//         }}
//       >
//         <h3>Insights</h3>
//         <p>
//           The bar chart provides a visual representation of the number of{" "}
//           <strong>Citations (Scopus)</strong> achieved by different research
//           groups. The highest-performing research group is{" "}
//           <strong>
//             {data.length > 0 &&
//               data.reduce((prev, current) =>
//                 prev.citationsScopus > current.citationsScopus ? prev : current
//               ).researchGroup}
//           </strong>{" "}
//           with a total of{" "}
//           <strong>
//             {data.length > 0 &&
//               data.reduce((prev, current) =>
//                 prev.citationsScopus > current.citationsScopus ? prev : current
//               ).citationsScopus}
//           </strong>{" "}
//           citations. The total citations across all research groups is{" "}
//           <strong>
//             {data.reduce((sum, item) => sum + item.citationsScopus, 0)}
//           </strong>
//           . Each research group is displayed using a unique color for easy
//           differentiation.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default CitationsScopusChart;

import React, { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";

const CitationsScopusChart = () => {
  const [data, setData] = useState([]); // Data from API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null); // Track the selected research group
  const [tableData, setTableData] = useState([]); // Data for the table

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/citationsScopusByResearchGroup"
        );
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const jsonData = await response.json();

        // Process data: Exclude invalid entries (e.g., N/A) and set data for the chart
        const processedData = jsonData
          .filter((item) => item.researchGroup !== "N/A") // Exclude invalid data
          .map((item) => ({
            researchGroup: getShortName(item.researchGroup), // Convert to short name
            citationsScopus: item.citationsScopus,
            scholars: item.scholars || [], // Add scholars if available
          }));
        setData(processedData);
      } catch (err) {
        console.error("Error fetching citations data:", err);
        setError("Failed to load chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to extract short names
  const getShortName = (fullName) => {
    const match = fullName.match(/\(([^)]+)\)/); // Extract content within parentheses
    return match ? match[1] : fullName; // Return short form or original name
  };

  const handleBarClick = (group) => {
    // Find the selected group and set table data
    const groupData = data.find((item) => item.researchGroup === group);
    setSelectedGroup(group); // Set the group for display
    setTableData(groupData?.scholars || []); // Set scholars data for the table
  };

  const closeTable = () => {
    setSelectedGroup(null); // Close the table by resetting selected group
    setTableData([]);
  };

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>{error}</p>;

  // Colors for bars
  const colors = [
    "#8dd3c7",
    "#ffffb3",
    "#bebada",
    "#fb8072",
    "#80b1d3",
    "#fdb462",
    "#b3de69",
  ];

  return (
    <div style={{ width: "80%", margin: "auto", textAlign: "center" }}>
      <h2>Citations (Scopus) by Research Group</h2>
      <div style={{ height: "500px" }}>
        <ResponsiveBar
          data={data}
          keys={["citationsScopus"]}
          indexBy="researchGroup"
          margin={{ top: 50, right: 50, bottom: 100, left: 60 }}
          padding={0.3}
          colors={({ index }) => colors[index % colors.length]} // Unique colors for bars
          borderColor={{
            from: "color",
            modifiers: [["darker", 1.6]],
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0, // Straight labels
            legend: "Research Group",
            legendPosition: "middle",
            legendOffset: 60,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Citations (Scopus)",
            legendPosition: "middle",
            legendOffset: -50,
          }}
          labelSkipWidth={16}
          labelSkipHeight={16}
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
              <strong>{indexValue}</strong>: {value}
            </div>
          )}
          onClick={(bar) => handleBarClick(bar.indexValue)} // Handle bar click
        />
      </div>

      {/* Insights Section */}
      <div
        style={{
          marginTop: "20px",
          paddingBottom: "30px",
          textAlign: "center",
        }}
      >
        <h3>Insights</h3>
        <p>
          The bar chart provides a visual representation of the number of{" "}
          <strong>Citations (Scopus)</strong> achieved by different research
          groups. The highest-performing research group is{" "}
          <strong>
            {data.length > 0 &&
              data.reduce((prev, current) =>
                prev.citationsScopus > current.citationsScopus ? prev : current
              ).researchGroup}
          </strong>{" "}
          with a total of{" "}
          <strong>
            {data.length > 0 &&
              data.reduce((prev, current) =>
                prev.citationsScopus > current.citationsScopus ? prev : current
              ).citationsScopus}
          </strong>{" "}
          citations. The total citations across all research groups is{" "}
          <strong>
            {data.reduce((sum, item) => sum + item.citationsScopus, 0)}
          </strong>
          . Each research group is displayed using a unique color for easy
          differentiation.
        </p>
      </div>

      {/* Table Section */}
      {selectedGroup && (
        <div
          style={{
            marginTop: "30px",
            backgroundColor: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3>Scholars in Research Group: {selectedGroup}</h3>
          <button
            onClick={closeTable}
            style={{
              backgroundColor: "#ff5c5c",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              marginBottom: "10px",
            }}
          >
            Close Table
          </button>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#ddd" }}>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                  Name
                </th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                  Citations (Scopus)
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.length > 0 ? (
                tableData.map((scholar, index) => (
                  <tr key={index}>
                    <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                      {scholar.name}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                      {scholar.citationsScopus}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      border: "1px solid #ccc",
                    }}
                  >
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CitationsScopusChart;
