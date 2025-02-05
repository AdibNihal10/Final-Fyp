// import { ResponsivePie } from "@nivo/pie";
// import { tokens } from "../theme";
// import { useTheme } from "@mui/material";
// import scholarData from "../data/scraped_scholar_data.json";

// const PieChart = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

//   // Prepare the data for the pie chart
//   const data = [
//     {
//       id: "National Grants",
//       value: scholarData.reduce(
//         (sum, item) => sum + (item["NATIONAL GRANTS"] || 0),
//         0
//       ),
//     },
//     {
//       id: "Industry Grants",
//       value: scholarData.reduce(
//         (sum, item) => sum + (item["INDUSTRY GRANTS"] || 0),
//         0
//       ),
//     },
//     {
//       id: "International Grants",
//       value: scholarData.reduce(
//         (sum, item) => sum + (item["INTERNATIONAL GRANTS"] || 0),
//         0
//       ),
//     },
//   ];

//   // Calculate the total for percentage calculation
//   const total = data.reduce((sum, entry) => sum + entry.value, 0);

//   // Add percentage labels
//   const dataWithPercentage = data.map((item) => ({
//     ...item,
//     label: `${((item.value / total) * 100).toFixed(1)}%`, // Calculate and format the percentage
//   }));

//   return (
//     <ResponsivePie
//       data={dataWithPercentage}
//       theme={{
//         axis: {
//           domain: {
//             line: {
//               stroke: colors.grey[100],
//             },
//           },
//           legend: {
//             text: {
//               fill: colors.grey[100],
//             },
//           },
//           ticks: {
//             line: {
//               stroke: colors.grey[100],
//               strokeWidth: 1,
//             },
//             text: {
//               fill: colors.grey[100],
//             },
//           },
//         },
//         legends: {
//           text: {
//             fill: colors.grey[100],
//           },
//         },
//       }}
//       margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
//       innerRadius={0.5}
//       padAngle={0.7}
//       cornerRadius={3}
//       activeOuterRadiusOffset={8}
//       borderColor={{
//         from: "color",
//         modifiers: [["darker", 0.2]],
//       }}
//       arcLinkLabelsSkipAngle={10}
//       arcLinkLabelsTextColor={colors.grey[100]}
//       arcLinkLabelsThickness={2}
//       arcLinkLabelsColor={{ from: "color" }}
//       enableArcLabels={true} // Enable arc labels
//       arcLabelsRadiusOffset={0.6} // Adjust position of labels
//       arcLabelsSkipAngle={10} // Minimum angle to display labels
//       arcLabelsTextColor={{
//         from: "color",
//         modifiers: [["darker", 2]],
//       }}
//       defs={[
//         {
//           id: "dots",
//           type: "patternDots",
//           background: "inherit",
//           color: "rgba(255, 255, 255, 0.3)",
//           size: 4,
//           padding: 1,
//           stagger: true,
//         },
//         {
//           id: "lines",
//           type: "patternLines",
//           background: "inherit",
//           color: "rgba(255, 255, 255, 0.9)",
//           rotation: -45,
//           lineWidth: 6,
//           spacing: 10,
//         },
//       ]}
//       legends={[
//         {
//           anchor: "bottom",
//           direction: "row",
//           justify: false,
//           translateX: 0,
//           translateY: 56,
//           itemsSpacing: 0,
//           itemWidth: 100,
//           itemHeight: 18,
//           itemTextColor: "#999",
//           itemDirection: "left-to-right",
//           itemOpacity: 1,
//           symbolSize: 18,
//           symbolShape: "circle",
//           effects: [
//             {
//               on: "hover",
//               style: {
//                 itemTextColor: "#000",
//               },
//             },
//           ],
//         },
//       ]}
//     />
//   );
// };

// export default PieChart;

import React, { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";

const PieChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [researchGroups, setResearchGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch research groups on component mount
  useEffect(() => {
    const fetchResearchGroups = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/research-groups"
        );
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const groups = await response.json();
        setResearchGroups(groups);
      } catch (err) {
        console.error("Error fetching research groups:", err);
        setError("Failed to load research groups.");
      }
    };

    fetchResearchGroups();
  }, []);

  // Fetch grants data based on selected research group
  useEffect(() => {
    const fetchGrantsData = async () => {
      try {
        setLoading(true);
        const url = selectedGroup
          ? `http://localhost:5000/api/grants?researchGroup=${encodeURIComponent(
              selectedGroup
            )}`
          : "http://localhost:5000/api/grants";

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const jsonData = await response.json();

        // Prepare the data for the pie chart
        const chartData = [
          { id: "National Grants", value: jsonData.nationalGrants || 0 },
          { id: "Industry Grants", value: jsonData.industryGrants || 0 },
          {
            id: "International Grants",
            value: jsonData.internationalGrants || 0,
          },
        ];

        // Calculate the total for percentage calculation
        const total = chartData.reduce((sum, entry) => sum + entry.value, 0);

        // Add percentage labels
        const dataWithPercentage = chartData.map((item) => ({
          ...item,
          label: `${((item.value / total) * 100).toFixed(1)}%`,
        }));

        setData(dataWithPercentage);
      } catch (err) {
        console.error("Error fetching grants data:", err);
        setError("Failed to load chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchGrantsData();
  }, [selectedGroup]);

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ height: "600px", width: "800px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Grants Overview</h2>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <label htmlFor="researchGroup">Filter by Research Group: </label>
        <select
          id="researchGroup"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          <option value="">All Research Groups</option>
          {researchGroups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
      </div>
      <ResponsivePie
        data={data}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: colors.grey[100],
              },
            },
            legend: {
              text: {
                fill: colors.grey[100],
              },
            },
            ticks: {
              line: {
                stroke: colors.grey[100],
                strokeWidth: 1,
              },
              text: {
                fill: colors.grey[100],
              },
            },
          },
          legends: {
            text: {
              fill: colors.grey[100],
            },
          },
        }}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor={colors.grey[100]}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        enableArcLabels={true}
        arcLabelsRadiusOffset={0.6}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.9)",
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
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
      />
    </div>
  );
};

export default PieChart;
