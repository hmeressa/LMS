import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
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
        <Typography variant="h3">404</Typography>
        <Typography variant="body">
          The page you are looking for cannot be found
        </Typography>
      </Box>

      <Button variant="contained" onClick={goHome}>
        Go to Home
      </Button>
    </Box>
  );
}
