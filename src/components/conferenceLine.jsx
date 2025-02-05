import React, { useEffect, useState } from "react";
import { ResponsiveLine } from "@nivo/line";

const ConferenceLineChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConferencesData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/conferences");
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const jsonData = await response.json();

        // Count occurrences of each year
        const yearWiseData = jsonData.reduce((acc, conference) => {
          if (!acc[conference.Year]) {
            acc[conference.Year] = 0;
          }
          acc[conference.Year] += 1;
          return acc;
        }, {});

        // Format data for the line chart
        const chartData = [
          {
            id: "Conferences",
            color: "hsl(220, 70%, 50%)",
            data: Object.keys(yearWiseData).map((year) => ({
              x: year,
              y: yearWiseData[year],
            })),
          },
        ];

        setData(chartData);
      } catch (err) {
        console.error("Error fetching conferences data:", err);
        setError("Failed to load chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchConferencesData();
  }, []);

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ height: "500px", width: "700px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Conferences Trend by Year</h2>
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Year",
          legendPosition: "middle",
          legendOffset: 36,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Count",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default ConferenceLineChart;
