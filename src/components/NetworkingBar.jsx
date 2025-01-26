// import React, { useEffect, useState } from "react";
// import { ResponsiveBar } from "@nivo/bar";

// const NetworkingBarChart = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/moumoa");
//         if (!response.ok) throw new Error(`Error: ${response.statusText}`);
//         const jsonData = await response.json();

//         // Aggregate data by Type
//         const typeCounts = jsonData.reduce((acc, item) => {
//           acc[item.Type] = (acc[item.Type] || 0) + 1;
//           return acc;
//         }, {});

//         const chartData = Object.keys(typeCounts).map((type, index) => ({
//           type,
//           count: typeCounts[type],
//           color: `hsl(${(index * 90) % 360}, 70%, 80%)`, // Generate light colors
//         }));

//         setData(chartData);
//       } catch (err) {
//         console.error("Error fetching networking data:", err);
//         setError("Failed to load data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) return <p>Loading chart...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div style={{ height: 500, width: 700, margin: "auto" }}>
//       <h2 style={{ textAlign: "center" }}>Count of Agreements by Type</h2>
//       <ResponsiveBar
//         data={data}
//         keys={["count"]}
//         indexBy="type"
//         margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
//         padding={0.3}
//         colors={(d) => d.data.color} // Assign unique colors to each bar
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
//           legend: "Type",
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
//         tooltip={(d) => (
//           <strong style={{ color: d.data.color }}>
//             {d.indexValue}: {d.value}
//           </strong>
//         )}
//       />
//     </div>
//   );
// };

// export default NetworkingBarChart;

import React, { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";

const NetworkingBarChart = () => {
  const [data, setData] = useState([]); // Bar chart data
  const [rawData, setRawData] = useState([]); // Full data from the API
  const [selectedTypeDetails, setSelectedTypeDetails] = useState([]); // Data for the table
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/networking");
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const jsonData = await response.json();

        // Format data for the bar chart
        const chartData = jsonData.map((item, index) => ({
          type: item.type,
          count: item.total,
          color: `hsl(${(index * 90) % 360}, 70%, 70%)`, // Generate unique colors
        }));

        setData(chartData); // Bar chart data
        setRawData(jsonData); // Full API data for table rendering
      } catch (err) {
        console.error("Error fetching networking data:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle bar click to show table
  const handleBarClick = (bar) => {
    const clickedType = bar.indexValue; // Type of the clicked bar
    const typeDetails = rawData.find((item) => item.type === clickedType);
    setSelectedTypeDetails(typeDetails ? typeDetails.details : []); // Update table data
  };

  // Close the table
  const closeTable = () => {
    setSelectedTypeDetails([]); // Clear table data
  };

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "auto", textAlign: "center" }}>
      <h2>Count of Agreements by Type</h2>
      <div style={{ height: 500, width: 700, margin: "auto" }}>
        <ResponsiveBar
          data={data}
          keys={["count"]}
          indexBy="type"
          margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
          padding={0.3}
          colors={(d) => d.data.color} // Assign unique colors to each bar
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
            legend: "Type",
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
          tooltip={(d) => (
            <strong style={{ color: d.data.color }}>
              {d.indexValue}: {d.value}
            </strong>
          )}
          onClick={handleBarClick} // Attach click handler
          role="application"
          ariaLabel="Bar chart of agreements count by type"
        />
      </div>

      {/* Table Section */}
      {selectedTypeDetails.length > 0 && (
        <div style={{ marginTop: "30px", paddingBottom: "30px" }}>
          <h3>Agreement Details for Type: {selectedTypeDetails[0]?.Type}</h3>
          <button
            onClick={closeTable}
            style={{
              marginBottom: "10px",
              padding: "10px 20px",
              backgroundColor: "#f44336",
              color: "#fff",
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
              marginTop: "10px",
              textAlign: "left",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>#</th>
                {/* <th style={{ border: "1px solid #ddd", padding: "8px" }}>No</th> */}
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Description
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Start Year
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  End Year
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  PIC
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedTypeDetails.map((agreement, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {index + 1} {/* Serial Number */}
                  </td>
                  {/* <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {agreement.No}
                  </td> */}
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {agreement.Description}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {agreement.StartYear}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {agreement.EndYear}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {agreement.PIC || "N/A"}
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

export default NetworkingBarChart;
