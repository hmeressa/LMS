import { useTheme } from "@emotion/react";
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone";
import MenuTwoToneIcon from "@mui/icons-material/MenuTwoTone";
import { Box, Container, IconButton } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Nav from "./nav/Nav";

export default function HomeLayout() {
  const theme = useTheme();
  const [hidden, setHidden] = useState(true);

  return (
    <Box>
      <Nav hidden={hidden} />

      <Container
        sx={{
          [theme.breakpoints.up("lg")]: {
            display: "none",
          },
          [theme.breakpoints.down("lg")]: {
            ml: () => (hidden ? 0 : "300px"),
          },
        }}>
        <IconButton onClick={() => setHidden(!hidden)}>
          {hidden ? <MenuTwoToneIcon /> : <CloseTwoToneIcon />}
        </IconButton>
      </Container>

      <Box
        sx={{
          flexGrow: 1,
          ml: "300px",
          [theme.breakpoints.down("lg")]: {
            ml: 0,
          },
        }}>
        <Box sx={{ my: 2, mx: 4, maxWidth: "100%", overflowX: "hidden" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
