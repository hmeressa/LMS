import LogoutTwoToneIcon from "@mui/icons-material/LogoutTwoTone";
import MoreVertTwoToneIcon from "@mui/icons-material/MoreVertTwoTone";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  Skeleton,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../../App";
import axiosInstance from "../../api";

export default function Profile() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { setIsLoggedIn, user, setUser } = useContext(authContext);
  const [avatar, setAvatar] = useState();

  const handleLogout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
  };

  useEffect(() => {
    const getAvatar = async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_API_URL}/avatar/getAvatar/${
            user && user.email
          }`,
          {
            responseType: "blob",
          }
        );

        if (response.status === 200) {
          const url = URL.createObjectURL(response.data);
          setAvatar(url);
        }
      } catch (e) {
        setAvatar("null");
      }
    };

    getAvatar();
  }, [user]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        pt: 2,
        borderTopColor: "action.selected",
        borderTopStyle: "solid",
        borderTopWidth: "1px",
      }}>
      {/* profile photo, name and position */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}>
        <Avatar
          src={`${avatar}`}
          alt={`${user && user.firstName}'s avatar`}
          sx={{ width: 48, height: 48 }}
        />
        <Box>
          <Typography variant="h6" sx={{ lineHeight: 1, fontWeight: "bold" }}>
            {user ? `${user.firstName} ${user.lastName}` : <Skeleton />}
          </Typography>
          <Typography variant="body2">
            {user ? user.team.teamName : <Skeleton />}
          </Typography>
        </Box>
      </Box>

      {/* show more button */}
      <Box>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <MoreVertTwoToneIcon />
        </IconButton>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{ vertical: "bottom", horizontal: "right" }}>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutTwoToneIcon />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </ListItemButton>
        </Popover>
      </Box>
    </Box>
  );
}
