import React, { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";

const PubStackedBarChart = () => {
  const [data, setData] = useState([]); // Raw data from API
  const [filteredData, setFilteredData] = useState([]); // Filtered data for chart
  const [researchGroups, setResearchGroups] = useState([]); // List of research groups
  const [selectedGroup, setSelectedGroup] = useState(""); // Selected research group
  const [tableData, setTableData] = useState([]); // Data for the table
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/allpublications"
        );
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const jsonData = await response.json();

        // Extract unique research groups
        const groups = [...new Set(jsonData.map((item) => item.researchGroup))];
        setResearchGroups(groups);

        // Set data
        setData(jsonData);
        setFilteredData(jsonData); // Default filtered data
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data by research group
  const handleGroupFilter = (group) => {
    setSelectedGroup(group);
    if (group) {
      setFilteredData(data.filter((d) => d.researchGroup === group));
    } else {
      setFilteredData(data); // Show all data if no filter is selected
    }
  };

  // Process data for the bar chart
  const chartData = filteredData.reduce((acc, scholar) => {
    scholar.publications.forEach((pub) => {
      const year = pub.year;
      const category =
        pub.publicationCategory === "Publication In Web Of Science"
          ? "webOfScience"
          : pub.publicationCategory === "Publication In Scopus"
          ? "scopus"
          : "other";

      // Find or create year entry
      let yearEntry = acc.find((entry) => entry.year === year);
      if (!yearEntry) {
        yearEntry = {
          year,
          webOfScience: 0,
          scopus: 0,
          other: 0,
          details: [],
        };
        acc.push(yearEntry);
      }

      // Increment count for category
      yearEntry[category]++;

      // Add details for table display
      yearEntry.details.push({
        scholarName: scholar.name,
        journalName: pub.journalName,
        typeOfAuthors: pub.typeOfAuthors,
      });
    });
    return acc;
  }, []);

  // Handle bar click
  const handleBarClick = (bar) => {
    const { year } = bar.data;
    const yearData = chartData.find((d) => d.year === year);
    if (yearData) {
      setTableData(yearData.details);
    }
  };

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ margin: "auto", textAlign: "center" }}>
      <h2>Publications by Year (Stacked Bar Chart)</h2>
      <label style={{ display: "block", marginBottom: "20px" }}>
        Filter by Research Group:{" "}
        <select
          value={selectedGroup}
          onChange={(e) => handleGroupFilter(e.target.value)}
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
          data={chartData.map((item) => ({
            year: item.year,
            webOfScience: item.webOfScience,
            scopus: item.scopus,
            other: item.other,
          }))}
          keys={["webOfScience", "scopus", "other"]}
          indexBy="year"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
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
            legend: "Number of Publications",
            legendPosition: "middle",
            legendOffset: -50,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{
            from: "color",
            modifiers: [["darker", 1.6]],
          }}
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
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
          tooltip={({ id, value, indexValue }) => (
            <strong>
              {id}: {value} ({indexValue})
            </strong>
          )}
          onClick={handleBarClick}
        />
      </div>
      {tableData.length > 0 && (
        <div
          style={{
            marginTop: "30px",
            marginRight: "30px",

            paddingBottom: "30px",
          }}
        >
          <h3>Details for Selected Year</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Scholar Name
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Journal Name
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Type of Author
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {item.scholarName}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {item.journalName}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {item.typeOfAuthors}
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

export default PubStackedBarChart;
