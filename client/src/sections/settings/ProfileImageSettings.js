import { useTheme } from "@emotion/react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../../App";
import axiosInstance from "../../api";
import CustomSnackbar from "../../components/alerts/CustomSnackbar";

export default function ProfileImage({ canEdit }) {
  const { user, getUserData } = useContext(authContext);
  const [avatar, setAvatar] = useState();
  const [notification, setNotification] = useState({});
  const theme = useTheme();

  const getAvatar = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_API_URL}/avatar/getAvatar/${user.email}`,
        {
          responseType: "blob",
        }
      );
      if (response.status === 200) {
        const url = URL.createObjectURL(response.data);
        setAvatar(url);
      }
    } catch (e) {
      setAvatar(null);
    }
  };

  useEffect(() => {
    getAvatar();
  }, []);

  const deleteAvatar = async () => {
    try {
      const response = await axiosInstance.delete(
        `${process.env.REACT_APP_API_URL}/avatar/delete/${user.email}`
      );

      if (response.status === 200) {
        notification.message = "Profile image deleted successfully";
        notification.severity = "success";
        getAvatar();
        getUserData();
      }
    } catch (e) {
      if (e.code === "ERR_NETWORK" || !e.response) {
        notification.message = "Network error. Please try again later";
        notification.severity = "error";
      } else {
        notification.message =
          "Cannot delete your profile image. Please try again later";
        notification.severity = "error";
      }
    }

    setNotification(notification);
  };

  const handleChange = async (e) => {
    try {
      const formData = new FormData();
      formData.append("image", e.target.files[0]);

      const response = await axiosInstance.patch(
        `${process.env.REACT_APP_API_URL}/avatar/update/${user.email}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      if (response.status === 200) {
        notification.message = "Profile image updated successfully";
        notification.severity = "success";
        getAvatar();
        getUserData(localStorage.getItem("id"));
      }
    } catch (e) {
      if (e.response.status === 404) {
        setAvatar(null);
      }
    }
  };

  return (
    <>
      {notification.message && (
        <CustomSnackbar
          notification={notification}
          setNotification={setNotification}
        />
      )}

      <Card>
        <CardHeader subheader="Profile Picture" />
        <CardContent>
          <Box>
            <Avatar
              src={`${avatar}`}
              alt={`${user && user.firstName}'s avatar`}
              sx={{
                width: 96,
                height: 96,
                mb: 2,
                [theme.breakpoints.down("sm")]: { mx: "auto" },
              }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                [theme.breakpoints.down("sm")]: { flexDirection: "column" },
              }}>
              <Button component="label" disabled={!canEdit}>
                Change profile photo
                <input
                  accept="image/*"
                  type="file"
                  hidden
                  onChange={handleChange}
                />
              </Button>
              <Divider flexItem />
              <Button
                color="error"
                onClick={deleteAvatar}
                disabled={!canEdit || avatar === null}>
                Remove profile photo
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
