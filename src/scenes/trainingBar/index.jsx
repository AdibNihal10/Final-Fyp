import { Box } from "@mui/material";
import Header from "../../components/Header";
import BarTraining from "../../components/BarTraining";

const TrainingBar = () => {
  return (
    <Box m="20px">
      <Header title="Bar Chart" subtitle="Simple Bar Chart" />
      <Box height="75vh">
        <BarTraining />
      </Box>
    </Box>
  );
};

export default TrainingBar;
