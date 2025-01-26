import { Box } from "@mui/material";
import Header from "../../components/Header";
import ConferenceBarChart from "../../components/ConferenceBar";

const ConferenceBar = () => {
  return (
    <Box m="20px">
      <Header />
      <Box height="75vh">
        <ConferenceBarChart />
      </Box>
    </Box>
  );
};

export default ConferenceBar;
