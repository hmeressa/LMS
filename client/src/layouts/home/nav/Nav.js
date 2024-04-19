import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import AdminPanelSettingsTwoToneIcon from "@mui/icons-material/AdminPanelSettingsTwoTone";
import BookTwoToneIcon from "@mui/icons-material/BookTwoTone";
import LibraryBooksTwoToneIcon from "@mui/icons-material/LibraryBooksTwoTone";
import SettingsTwoToneIcon from "@mui/icons-material/SettingsTwoTone";
import SpaceDashboardTwoToneIcon from "@mui/icons-material/SpaceDashboardTwoTone";
import { Box } from "@mui/material";
import { useContext } from "react";
import { authContext } from "../../../App";
import NavSection from "../../../components/nav-section/NavSection";

const StyledNavContainer = styled("div")(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.primary.dark
      : theme.palette.background.paper,
  position: "fixed",
  top: 0,
  bottom: 0,
  zIndex: 1,
}));

export default function Nav({ hidden }) {
  const { user } = useContext(authContext);
  const theme = useTheme();

  const navConfig = [
    {
      title: "My Courses",
      icon: <BookTwoToneIcon />,
      path: "/my-courses",
      canView: user && user.role.permissions.allCourses.view,
    },
    {
      title: "All Courses",
      icon: <LibraryBooksTwoToneIcon />,
      path: "/all-courses",
      canView: user && user.role.permissions.allCourses.view,
    },
    {
      title: "Dashboard",
      icon: <SpaceDashboardTwoToneIcon />,
      path: "/dashboard",
      canView: user && user.role.permissions.dashboard.view,
    },
    {
      title: "Settings",
      icon: <SettingsTwoToneIcon />,
      path: "/settings",
      canView: user && user.role.permissions.settings.view,
    },
    {
      title: "Site Administration",
      icon: <AdminPanelSettingsTwoToneIcon />,
      path: "/site-administration",
      canView:
        user &&
        (user.role.permissions.siteAdmin_users.view ||
          user.role.permissions.siteAdmin_courses.view ||
          user.role.permissions.siteAdmin_teams.view ||
          user.role.permissions.siteAdmin_privileges.view ||
          user.role.permissions.siteAdmin_announcements.view ||
          user.role.permissions.siteAdmin_categories.view ||
          user.role.permissions.siteAdmin_roles.view),
    },
    {
      title: "Admin Dashboard",
      icon: <SpaceDashboardTwoToneIcon />,
      path: "/admin-dashboard",
      canView: user && user.role.permissions.siteAdmin_dashboard.view,
    },
  ];

  const allowedRoutes = navConfig.filter((route) => {
    return route.canView;
  });

  return (
    <StyledNavContainer>
      <Box
        sx={{
          width: 300,
          height: "100%",
          p: 2,
          borderRightWidth: 1,
          borderRightColor: "action.selected",
          borderRightStyle: "solid",
          [theme.breakpoints.down("lg")]: {
            display: () => (hidden ? "none" : "block"),
            top: 0,
            bottom: 0,
          },
        }}>
        <NavSection navConfig={allowedRoutes} />
      </Box>
    </StyledNavContainer>
  );
}
