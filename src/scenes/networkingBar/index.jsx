import { Box } from "@mui/material";
import Header from "../../components/Header";

import NetworkingBarChart from "../../components/NetworkingBar";

const NBar = () => {
  return (
    <Box m="20px">
      <Header />
      <Box height="75vh">
        <NetworkingBarChart />
      </Box>
    </Box>
  );
};

export default NBar;
