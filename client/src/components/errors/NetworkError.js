import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NetworkError() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/my-courses");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        mx: "auto",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 4,
      }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Typography variant="h3">Network Error</Typography>
        <Typography variant="body">
          Check your internet connection and try again.
        </Typography>
      </Box>

      <Button variant="contained" onClick={goHome}>
        Go to Home
      </Button>
    </Box>
  );
}
