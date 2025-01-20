import { Box, IconButton, Button, useTheme } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate(); // Initialize useNavigate
  const handleLoginClick = () => {
    navigate("/login"); // Navigate to the login route
  };
  // const handlePersonClick = () => {
  //   navigate("/login"); // Navigate to the login route
  // };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      p={2}
      backgroundColor="khaki"
    >
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      ></Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton>
          {" "}
          {/* Added onClick */}
          <PersonOutlinedIcon />
        </IconButton>
        {/* Login Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleLoginClick}
          sx={{ ml: 2 }}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default Topbar;
