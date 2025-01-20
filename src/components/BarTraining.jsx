// import React, { useEffect, useState } from "react";
// import { ResponsiveBar } from "@nivo/bar";

// const BarTraining = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProjectsData = async () => {
//       try {
//         const response = await fetch(
//           "http://localhost:5000/api/trainingProjects"
//         );
//         if (!response.ok) throw new Error(`Error: ${response.statusText}`);
//         const jsonData = await response.json();

//         // Count occurrences of each year
//         const yearWiseData = jsonData.reduce((acc, project) => {
//           if (!acc[project.Year]) {
//             acc[project.Year] = 0;
//           }
//           acc[project.Year] += 1;
//           return acc;
//         }, {});

//         // Format data for the chart
//         const chartData = Object.keys(yearWiseData).map((year) => ({
//           year: year,
//           count: yearWiseData[year],
//         }));

//         setData(chartData);
//       } catch (err) {
//         console.error("Error fetching training projects data:", err);
//         setError("Failed to load chart data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjectsData();
//   }, []);

//   if (loading) return <p>Loading chart...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div style={{ height: "500px", width: "700px", margin: "auto" }}>
//       <h2 style={{ textAlign: "center" }}>Projects Count by Year</h2>
//       <ResponsiveBar
//         data={data}
//         keys={["count"]}
//         indexBy="year"
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
//         ariaLabel="Bar chart of project counts by year"
//       />
//     </div>
//   );
// };

// export default BarTraining;

import React, { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";

const BarTraining = () => {
  const [data, setData] = useState([]); // Data for the bar chart
  const [rawData, setRawData] = useState([]); // Raw data from the API
  const [selectedYearProjects, setSelectedYearProjects] = useState([]); // Data for the table
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/TProjects");
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const jsonData = await response.json();

        // Prepare data for the bar chart
        const chartData = jsonData.map((item) => ({
          year: item.year.toString(),
          count: item.totalTrainings,
        }));

        setData(chartData); // Bar chart data
        setRawData(jsonData); // Raw data for table rendering
      } catch (err) {
        console.error("Error fetching training projects data:", err);
        setError("Failed to load chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsData();
  }, []);

  // Handle bar click to filter projects by year
  const handleBarClick = (bar) => {
    const clickedYear = bar.indexValue; // Year of the clicked bar
    const yearData = rawData.find(
      (item) => item.year.toString() === clickedYear
    );
    setSelectedYearProjects(yearData ? yearData.projects : []); // Set table data
  };

  // Hide the table
  const closeTable = () => {
    setSelectedYearProjects([]); // Clear the selected year projects
  };

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "auto", textAlign: "center" }}>
      <h2>Projects Count by Year</h2>
      <div style={{ height: "500px", width: "700px", margin: "auto" }}>
        <ResponsiveBar
          data={data}
          keys={["count"]}
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
          onClick={handleBarClick} // Attach click handler
          role="application"
          ariaLabel="Bar chart of project counts by year"
        />
      </div>

      {/* Table Section */}
      {selectedYearProjects.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h3>Project Details for Year {selectedYearProjects[0]?.Year}</h3>
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
              paddingBottom: "30px",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>#</th>
                {/* <th style={{ border: "1px solid #ddd", padding: "8px" }}>Bil</th> */}
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Ketua Projek
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Vot
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Tajuk Projek
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Klien
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Kos Projek
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedYearProjects.map((project, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {index + 1} {/* Serial number */}
                  </td>
                  {/* <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {project.Bil}
                  </td> */}
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {project.KetuaProjek}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {project.Vot}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {project.TajukProjek}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {project.Klien}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {Number(project.KosProjek).toLocaleString("en-MY", {
                      style: "currency",
                      currency: "MYR",
                    })}
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

export default BarTraining;
