// import React, { useEffect, useState } from "react";
// import { ResponsiveBar } from "@nivo/bar";

// const ConferenceBarChart = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchConferencesData = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/conferences");
//         if (!response.ok) throw new Error(`Error: ${response.statusText}`);
//         const jsonData = await response.json();

//         // Count occurrences of each year
//         const yearWiseData = jsonData.reduce((acc, conference) => {
//           if (!acc[conference.Year]) {
//             acc[conference.Year] = 0;
//           }
//           acc[conference.Year] += 1;
//           return acc;
//         }, {});

//         // Format data for the bar chart
//         const chartData = Object.keys(yearWiseData).map((year, index) => ({
//           year: year,
//           count: yearWiseData[year],
//           color: `hsl(${(index * 90) % 360}, 70%, 50%)`, // Generate unique colors
//         }));

//         setData(chartData);
//       } catch (err) {
//         console.error("Error fetching conferences data:", err);
//         setError("Failed to load chart data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchConferencesData();
//   }, []);

//   if (loading) return <p>Loading chart...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div style={{ height: "500px", width: "700px", margin: "auto" }}>
//       <h2 style={{ textAlign: "center" }}>Conferences Count by Year</h2>
//       <ResponsiveBar
//         data={data}
//         keys={["count"]}
//         indexBy="year"
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
//           legend: "Year",
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
//         ariaLabel="Bar chart of conference counts by year"
//         tooltip={(d) => (
//           <strong style={{ color: d.data.color }}>
//             {d.indexValue}: {d.value}
//           </strong>
//         )}
//       />
//     </div>
//   );
// };

// export default ConferenceBarChart;

import React, { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";

const ConferenceBarChart = () => {
  const [chartData, setChartData] = useState([]); // Data for the bar chart
  const [rawData, setRawData] = useState([]); // Raw data from the API
  const [selectedYearDetails, setSelectedYearDetails] = useState([]); // Data for the table
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConferencesData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/allconferences"
        );
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const jsonData = await response.json();

        // Prepare data for the bar chart
        const chartDataFormatted = jsonData.map((item, index) => ({
          year: item.year.toString(),
          count: item.totalConferences,
          color: `hsl(${(index * 90) % 360}, 70%, 50%)`, // Unique colors
        }));

        setChartData(chartDataFormatted); // Set chart data
        setRawData(jsonData); // Set raw API data for table
      } catch (err) {
        console.error("Error fetching conferences data:", err);
        setError("Failed to load chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchConferencesData();
  }, []);

  // Handle bar click to display table
  const handleBarClick = (bar) => {
    const clickedYear = bar.indexValue; // Year of the clicked bar
    const yearData = rawData.find(
      (item) => item.year.toString() === clickedYear
    );
    setSelectedYearDetails(yearData ? yearData.details : []); // Update table data
  };

  // Close table
  const closeTable = () => {
    setSelectedYearDetails([]); // Clear the table data
  };

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "auto", textAlign: "center" }}>
      <h2>Conferences Count by Year</h2>
      <div style={{ height: "500px", width: "700px", margin: "auto" }}>
        <ResponsiveBar
          data={chartData}
          keys={["count"]}
          indexBy="year"
          margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
          padding={0.3}
          colors={(d) => d.data.color} // Assign unique colors to bars
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
          ariaLabel="Bar chart of conference counts by year"
        />
      </div>

      {/* Table Section */}
      {selectedYearDetails.length > 0 && (
        <div style={{ marginTop: "30px", paddingBottom: "30px" }}>
          <h3>Conference Details for Year {selectedYearDetails[0]?.Year}</h3>
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
                  Title
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Date
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Venue
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Note
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedYearDetails.map((conference, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {index + 1} {/* Serial Number */}
                  </td>
                  {/* <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {conference.No}
                  </td> */}
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {conference.Title}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {conference.Date}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {conference.Venue}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {conference.Note}
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

export default ConferenceBarChart;
