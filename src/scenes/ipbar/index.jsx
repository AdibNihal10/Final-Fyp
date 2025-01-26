import { Box } from "@mui/material";
import Header from "../../components/Header";

import ResearchGroupBarChart from "../../components/IpBar";

const IpBar = () => {
  return (
    <Box m="20px">
      <Header />
      <Box height="75vh">
        <ResearchGroupBarChart />
      </Box>
    </Box>
  );
};

export default IpBar;
