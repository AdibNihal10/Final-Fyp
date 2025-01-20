// import React, { useEffect, useState } from "react";
// import { ResponsiveBar } from "@nivo/bar";

// const GBarChart = () => {
//   const [data, setData] = useState([]);
//   const [researchGroups, setResearchGroups] = useState([]);
//   const [selectedGroup, setSelectedGroup] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch research groups and data
//   useEffect(() => {
//     const fetchResearchGroups = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/grantsByYear");
//         if (!response.ok) throw new Error(`Error: ${response.statusText}`);
//         const jsonData = await response.json();

//         // Extract unique research groups
//         const uniqueGroups = [
//           ...new Set(jsonData.map((item) => item.researchGroup)),
//         ];
//         setResearchGroups(uniqueGroups);
//         setData(jsonData);
//       } catch (err) {
//         console.error("Error fetching grants data:", err);
//         setError("Failed to load chart data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResearchGroups();
//   }, []);

//   // Filter data based on the selected group
//   const filteredData = selectedGroup
//     ? data.filter((item) => item.researchGroup === selectedGroup)
//     : data;

//   if (loading) return <p>Loading chart...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div style={{ margin: "auto", textAlign: "center" }}>
//       <h2>Grants by Year</h2>
//       <label style={{ display: "block", marginBottom: "20px" }}>
//         Filter by Research Group:{" "}
//         <select
//           value={selectedGroup}
//           onChange={(e) => setSelectedGroup(e.target.value)}
//           style={{ padding: "5px" }}
//         >
//           <option value="">All Research Groups</option>
//           {researchGroups.map((group) => (
//             <option key={group} value={group}>
//               {group}
//             </option>
//           ))}
//         </select>
//       </label>
//       <div style={{ height: "500px", width: "80%", margin: "auto" }}>
//         <ResponsiveBar
//           data={filteredData.map((item) => ({
//             year: item.year,
//             totalGrants: item.totalGrants,
//           }))}
//           keys={["totalGrants"]}
//           indexBy="year"
//           margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
//           padding={0.3}
//           colors={{ scheme: "set2" }}
//           borderColor={{
//             from: "color",
//             modifiers: [["darker", 1.6]],
//           }}
//           axisTop={null}
//           axisRight={null}
//           axisBottom={{
//             tickSize: 5,
//             tickPadding: 5,
//             tickRotation: 0,
//             legend: "Year",
//             legendPosition: "middle",
//             legendOffset: 40,
//           }}
//           axisLeft={{
//             tickSize: 5,
//             tickPadding: 5,
//             tickRotation: 0,
//             legend: "Number of Grants",
//             legendPosition: "middle",
//             legendOffset: -50,
//           }}
//           labelSkipWidth={12}
//           labelSkipHeight={12}
//           labelTextColor={{
//             from: "color",
//             modifiers: [["darker", 1.6]],
//           }}
//           tooltip={({ indexValue, value }) => (
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
//               anchor: "bottom",
//               direction: "row",
//               justify: false,
//               translateX: 0,
//               translateY: 50,
//               itemsSpacing: 0,
//               itemWidth: 100,
//               itemHeight: 18,
//               itemDirection: "left-to-right",
//               itemOpacity: 1,
//               symbolSize: 18,
//               effects: [
//                 {
//                   on: "hover",
//                   style: {
//                     itemOpacity: 0.7,
//                   },
//                 },
//               ],
//             },
//           ]}
//         />
//       </div>
//     </div>
//   );
// };

// export default GBarChart;

import React, { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";

const GBarChart = () => {
  const [data, setData] = useState([]);
  const [researchGroups, setResearchGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [filteredYearlyData, setFilteredYearlyData] = useState([]); // Data grouped by year
  const [selectedYearData, setSelectedYearData] = useState([]); // Data for the clicked bar
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGrantsData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/allGrantsData");
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const jsonData = await response.json();

        // Extract unique research groups
        const uniqueGroups = [
          ...new Set(jsonData.map((item) => item.researchGroup)),
        ];

        setData(jsonData); // Store raw data
        setResearchGroups(uniqueGroups); // Store unique research groups
      } catch (err) {
        console.error("Error fetching grants data:", err);
        setError("Failed to load chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchGrantsData();
  }, []);

  // Filter and group data based on the selected research group
  useEffect(() => {
    let filteredData = data;

    if (selectedGroup) {
      filteredData = data.filter(
        (item) => item.researchGroup === selectedGroup
      );
    }

    // Group data by year
    const groupedByYear = filteredData.reduce((acc, item) => {
      item.grants.forEach((grant) => {
        const existingYear = acc.find((d) => d.year === grant.year);
        if (existingYear) {
          existingYear.totalGrants += 1;
        } else {
          acc.push({ year: grant.year, totalGrants: 1 });
        }
      });
      return acc;
    }, []);

    setFilteredYearlyData(groupedByYear);
  }, [selectedGroup, data]);

  // Handle bar click to display data for the selected year
  const handleBarClick = (barData) => {
    const year = barData.indexValue; // Year of the clicked bar
    const filteredYearData = data
      .filter(
        (item) =>
          selectedGroup
            ? item.researchGroup === selectedGroup // Filter by selected group
            : true // Include all groups if no group is selected
      )
      .flatMap((item) =>
        item.grants
          .filter((grant) => grant.year === year) // Filter by year
          .map((grant) => ({
            scholarName: item.name, // Scholar's name
            grantName: grant.grantName, // Grant's name
            sponsor: grant.sponsor, // Grant's sponsor
            type: grant.type, // Grant's type
          }))
      );

    setSelectedYearData(filteredYearData);
  };

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ margin: "auto", textAlign: "center" }}>
      <h2>Grants by Year</h2>
      <label style={{ display: "block", marginBottom: "20px" }}>
        Filter by Research Group:{" "}
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          style={{ padding: "5px" }}
        >
          <option value="">All Research Groups</option>
          {researchGroups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
      </label>
      <div style={{ height: "500px", width: "80%", margin: "auto" }}>
        <ResponsiveBar
          data={filteredYearlyData}
          keys={["totalGrants"]}
          indexBy="year"
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
            legend: "Year",
            legendPosition: "middle",
            legendOffset: 40,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Number of Grants",
            legendPosition: "middle",
            legendOffset: -50,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{
            from: "color",
            modifiers: [["darker", 1.6]],
          }}
          tooltip={({ indexValue, value }) => (
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
          onClick={handleBarClick} // Handle bar click to display data
        />
      </div>

      {selectedYearData.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h3>Grants Data for Selected Year</h3>
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
                  Grant Name
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Sponsor
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Type
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedYearData.map((grant, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {grant.scholarName}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {grant.grantName}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {grant.sponsor}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {grant.type}
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

export default GBarChart;
