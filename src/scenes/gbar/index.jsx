import { Box } from "@mui/material";
import Header from "../../components/Header";

import GBarChart from "../../components/GBar";

const GBar = () => {
  return (
    <Box m="20px">
      <Header title="Bar Chart" subtitle="Simple Bar Chart" />
      <Box height="75vh">
        <GBarChart />
      </Box>
    </Box>
  );
};

export default GBar;
