import { Box } from "@mui/material";
import Header from "../../components/Header";

import NetworkingLineChart from "../../components/NetworkingLine";

const NLine = () => {
  return (
    <Box m="20px">
      <Header title="Line Chart" subtitle="Simple Line Chart" />
      <Box height="75vh">
        <NetworkingLineChart />
      </Box>
    </Box>
  );
};

export default NLine;
