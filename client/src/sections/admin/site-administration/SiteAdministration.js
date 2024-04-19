import { useTheme } from "@emotion/react";
import ChevronLeftTwoToneIcon from "@mui/icons-material/ChevronLeftTwoTone";
import ChevronRightTwoToneIcon from "@mui/icons-material/ChevronRightTwoTone";
import { Box, IconButton } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";

export default function SiteAdministration(second) {
  const [isHidden, setIsHidden] = useState(true);
  const theme = useTheme();

  return (
    <>
      <Box>
        <IconButton
          sx={{
            position: "fixed",
            top: 0,
            right: 0,
            [theme.breakpoints.up("md")]: {
              display: "none",
            },
            [theme.breakpoints.down("md")]: {
              zIndex: 1,
            },
          }}
          onClick={() => setIsHidden(!isHidden)}>
          {isHidden ? <ChevronLeftTwoToneIcon /> : <ChevronRightTwoToneIcon />}
        </IconButton>

        <TopNav isHidden={isHidden} />
      </Box>

      <Outlet />
    </>
  );
}
