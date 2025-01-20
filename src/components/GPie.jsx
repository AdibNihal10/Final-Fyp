import React, { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";

const GPieChart = () => {
  const [data, setData] = useState([]);
  const [researchGroups, setResearchGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch research groups and data
  useEffect(() => {
    const fetchGrantsData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/grantsByYear");
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const jsonData = await response.json();

        // Extract unique research groups
        const uniqueGroups = [
          ...new Set(jsonData.map((item) => item.researchGroup)),
        ];
        setResearchGroups(uniqueGroups);
        setData(jsonData);
      } catch (err) {
        console.error("Error fetching grants data:", err);
        setError("Failed to load chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchGrantsData();
  }, []);

  // Filter data based on the selected group
  const filteredData = selectedGroup
    ? data.filter((item) => item.researchGroup === selectedGroup)
    : data;

  // Prepare data for pie chart
  const pieChartData = filteredData.reduce((acc, item) => {
    const yearIndex = acc.findIndex((entry) => entry.id === item.year);
    if (yearIndex !== -1) {
      acc[yearIndex].value += item.totalGrants;
    } else {
      acc.push({ id: item.year, value: item.totalGrants });
    }
    return acc;
  }, []);

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ margin: "auto", textAlign: "center" }}>
      <h2>Grants Distribution by Year</h2>
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
        <ResponsivePie
          data={pieChartData}
          margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
          innerRadius={0.4}
          padAngle={0.7}
          cornerRadius={3}
          colors={{ scheme: "set2" }}
          borderWidth={1}
          borderColor={{
            from: "color",
            modifiers: [["darker", 0.2]],
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{
            from: "color",
            modifiers: [["darker", 2]],
          }}
          tooltip={({ datum }) => (
            <div
              style={{
                padding: "5px",
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "3px",
              }}
            >
              <strong>{datum.id}</strong>: {datum.value} grants
            </div>
          )}
          legends={[
            {
              anchor: "bottom",
              direction: "row",
              justify: false,
              translateX: 0,
              translateY: 50,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemDirection: "left-to-right",
              itemOpacity: 1,
              symbolSize: 18,
              effects: [
                {
                  on: "hover",
                  style: {
                    itemOpacity: 0.7,
                  },
                },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
};

export default GPieChart;
