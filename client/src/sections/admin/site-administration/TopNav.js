import { useTheme } from "@emotion/react";
import {
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { authContext } from "../../../App";

export default function TopNav({ isHidden }) {
  const { user } = useContext(authContext);
  const theme = useTheme();

  const topNavItems = [
    {
      path: "/site-administration/users",
      title: "Users",
      canView: user && user.role.permissions.siteAdmin_users.view,
    },
    {
      path: "/site-administration/teams",
      title: "Teams",
      canView: user && user.role.permissions.siteAdmin_teams.view,
    },
    {
      path: "/site-administration/courses",
      title: "Courses",
      canView: user && user.role.permissions.siteAdmin_courses.view,
    },
    {
      path: "/site-administration/categories",
      title: "Categories",
      canView: user && user.role.permissions.siteAdmin_categories.view,
    },
    {
      path: "/site-administration/roles",
      title: "Roles",
      canView: user && user.role.permissions.siteAdmin_roles.view,
    },

    {
      path: "/site-administration/privileges",
      title: "Privileges",
      canView: user && user.role.permissions.siteAdmin_privileges.view,
    },
    {
      path: "/site-administration/announcements",
      title: "Announcements",
      canView: user && user.role.permissions.siteAdmin_announcements.view,
    },
  ];

  const allowedTopNavItems = topNavItems.filter((item) => {
    return item.canView;
  });

  return (
    <Paper
      elevation={2}
      sx={{
        mb: 4,
        [theme.breakpoints.down("md")]: {
          display: isHidden ? "none" : "fixed",
          position: "fixed",
          top: 50,
          right: 0,
          zIndex: 1
        },
      }}>
      <List
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          flexWrap: "wrap",
          p: 0,
          [theme.breakpoints.down("md")]: {
            flexDirection: "column",
            justifyContent: "center",
            flexWrap: "wrap",
          },
        }}>
        {allowedTopNavItems.map(({ path, title }) => {
          return (
            <ListItemButton
              key={title}
              component={NavLink}
              to={path}
              className="parent"
              sx={{
                borderRadius: "4px",
                py: 0,
                "&.active": {
                  backgroundColor: "primary.main",
                },
                "&.active .child": {
                  fontWeight: "bold",
                },
                transition: "background-color 0.3s",
              }}>
              <ListItemText
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  py: 1,
                }}>
                <Typography className="child">{title}</Typography>
              </ListItemText>
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );
}
