import { Box } from "@mui/material";
import Header from "../../components/Header";

import PubStackedBarChart from "../../components/PubBar";

const PGBar = () => {
  return (
    <Box m="20px">
      <Header title="Bar Chart" subtitle="Simple Bar Chart" />
      <Box height="75vh">
        <PubStackedBarChart />
      </Box>
    </Box>
  );
};

export default PGBar;
