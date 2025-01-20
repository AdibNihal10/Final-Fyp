// import React, { useEffect, useState } from "react";
// import { ResponsiveBar } from "@nivo/bar";

// const ResearchGroupBarChart = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchIpData = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/ipData");
//         if (!response.ok) throw new Error(`Error: ${response.statusText}`);
//         const jsonData = await response.json();

//         // Prepare data for the bar chart
//         const chartData = jsonData.map((group) => ({
//           fullResearchGroup: group._id, // Store the full name for tooltip
//           researchGroup: group._id.replace("Research Group ", ""), // Shortened form for X-axis
//           ipFiled: group.totalIpFiled,
//         }));

//         setData(chartData);
//       } catch (err) {
//         console.error("Error fetching IP data:", err);
//         setError("Failed to load chart data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchIpData();
//   }, []);

//   if (loading) return <p>Loading chart...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div
//       style={{
//         height: "500px",
//         width: "80%",
//         margin: "auto",
//         textAlign: "center",
//       }}
//     >
//       <h2 style={{ marginBottom: "20px" }}>
//         Intellectual Properties Filed by Research Groups
//       </h2>
//       <ResponsiveBar
//         data={data}
//         keys={["ipFiled"]}
//         indexBy="researchGroup"
//         margin={{ top: 50, right: 50, bottom: 100, left: 60 }}
//         padding={0.3}
//         colors={{ scheme: "pastel1" }}
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
//           legend: "Research Group",
//           legendPosition: "middle",
//           legendOffset: 60,
//         }}
//         axisLeft={{
//           tickSize: 5,
//           tickPadding: 5,
//           tickRotation: 0,
//           legend: "IP Filed",
//           legendPosition: "middle",
//           legendOffset: -50,
//         }}
//         labelSkipWidth={16}
//         labelSkipHeight={16}
//         labelTextColor="black"
//         tooltip={({ data, value, color }) => (
//           <div
//             style={{
//               padding: "10px",
//               background: color,
//               color: "white",
//               borderRadius: "4px",
//             }}
//           >
//             <strong>Research Group:</strong> {data.fullResearchGroup} <br />
//             <strong>IP Filed:</strong> {value}
//           </div>
//         )}
//         legends={[
//           {
//             dataFrom: "keys",
//             anchor: "bottom-right",
//             direction: "row",
//             justify: false,
//             translateX: 0,
//             translateY: 50,
//             itemsSpacing: 10,
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
//         role="application"
//         ariaLabel="Bar chart showing intellectual properties filed by research groups"
//       />
//     </div>
//   );
// };

// export default ResearchGroupBarChart;

import React, { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";

const ResearchGroupBarChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGroupData, setSelectedGroupData] = useState([]); // For table display
  const [scholarData, setScholarData] = useState([]); // Full API data

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/allScholarData"
        );
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const jsonData = await response.json();

        // Aggregate data by research group to calculate the total IP filed
        const aggregatedData = jsonData.reduce((acc, group) => {
          const groupName = group.researchGroup;
          const ipCount = group.intellectualProperties.length;

          if (!acc[groupName]) {
            acc[groupName] = {
              fullResearchGroup: groupName,
              researchGroup: groupName.replace("Research Group ", ""),
              ipFiled: 0,
              intellectualProperties: [],
            };
          }

          acc[groupName].ipFiled += ipCount;
          acc[groupName].intellectualProperties.push(
            ...group.intellectualProperties.map((ip) => ({
              ...ip,
              name: group.name, // Include the scholar's name
            }))
          );

          return acc;
        }, {});

        const chartData = Object.values(aggregatedData); // Convert aggregated data to array format
        setScholarData(chartData); // Store full aggregated data
        setData(chartData); // Set chart data
      } catch (err) {
        console.error("Error fetching scholar data:", err);
        setError("Failed to load chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleBarClick = (barData) => {
    // Find the selected group's intellectual properties
    const selectedGroup = scholarData.find(
      (group) => group.researchGroup === barData.indexValue
    );

    setSelectedGroupData(selectedGroup?.intellectualProperties || []);
  };

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div
      style={{
        height: "500px",
        width: "80%",
        margin: "auto",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>
        Intellectual Properties Filed by Research Groups
      </h2>
      <ResponsiveBar
        data={data}
        keys={["ipFiled"]}
        indexBy="researchGroup"
        margin={{ top: 50, right: 50, bottom: 100, left: 60 }}
        padding={0.3}
        colors={{ scheme: "pastel1" }}
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
          legend: "Research Group",
          legendPosition: "middle",
          legendOffset: 60,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "IP Filed",
          legendPosition: "middle",
          legendOffset: -50,
        }}
        labelSkipWidth={16}
        labelSkipHeight={16}
        labelTextColor="black"
        tooltip={({ data, value, color }) => (
          <div
            style={{
              padding: "10px",
              background: color,
              color: "white",
              borderRadius: "4px",
            }}
          >
            <strong>Research Group:</strong> {data.fullResearchGroup} <br />
            <strong>IP Filed:</strong> {value}
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
            itemsSpacing: 10,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            symbolSize: 18,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
        role="application"
        ariaLabel="Bar chart showing intellectual properties filed by research groups"
        onClick={handleBarClick} // Triggered when a bar is clicked
      />

      {selectedGroupData.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h3>Selected Group Intellectual Properties</h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "10px",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Scholar Name
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  IP Name
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  IP Category
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedGroupData.map((ip, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {ip.name}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {ip.ipName}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {ip.ipCategory}
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

export default ResearchGroupBarChart;
