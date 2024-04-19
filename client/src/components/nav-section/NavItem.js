import { useTheme } from "@emotion/react";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";

export function NavItem({ item }) {
  const { title, icon, path } = item;
  const theme = useTheme();

  return (
    <ListItemButton
      className="parent"
      component={NavLink}
      to={path}
      sx={{
        "&.active": {
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.background.paper
              : theme.palette.primary.dark,
          boxShadow: 0,
        },
        "&.active .child": {
          fontWeight: "bold",
        },
        borderRadius: "4px",
      }}>
      <ListItemIcon sx={{ minWidth: 48 }}>{icon}</ListItemIcon>
      <ListItemText>
        <Typography className="child">{title}</Typography>
      </ListItemText>
    </ListItemButton>
  );
}
