import { Box } from "@mui/material";
import Header from "../../components/Header";
import ConferenceLineChart from "../../components/conferenceLine";

const ConferenceLine = () => {
  return (
    <Box m="20px">
      <Header title="Line Chart" subtitle="Simple Line Chart" />
      <Box height="75vh">
        <ConferenceLineChart />
      </Box>
    </Box>
  );
};

export default ConferenceLine;
