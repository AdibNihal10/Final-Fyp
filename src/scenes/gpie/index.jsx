import { Box } from "@mui/material";
import Header from "../../components/Header";

import GPieChart from "../../components/GPie";

const GPie = () => {
  return (
    <Box>
      <Header title="Grants" subtitle="" />
      <Box height="270px" width="100%">
        <GPieChart />
      </Box>
    </Box>
  );
};

export default GPie;
