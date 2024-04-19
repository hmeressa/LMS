import { Box, List, Typography } from "@mui/material";
import { NavItem } from "./NavItem";
import Profile from "./Profile";

export default function NavSection({ navConfig, hidden }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        height: "100%",
      }}>
      {/* Brand icon and text on top of navigation sidebar start */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 2,
          pb: 2,
          borderBottomColor: "action.selected",
          borderBottomStyle: "solid",
          borderBottomWidth: "1px",
        }}>
        <img src="/assets/logo.png" alt="IE logo" width={32} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", lineHeight: 1 }}>
            IE Network Solutions
          </Typography>
          <Typography variant="body2">Learning Management System</Typography>
        </Box>
      </Box>
      {/* Brand icon and text on top of navigation sidebar end */}
      <List disablePadding>
        {navConfig.map((navItem) => {
          return <NavItem key={navItem.title} item={navItem} />;
        })}
      </List>
      <Box sx={{ flexGrow: 1 }}></Box> {/** used as separator */}
      <Profile />
    </Box>
  );
}
