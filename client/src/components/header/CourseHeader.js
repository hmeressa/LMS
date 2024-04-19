import { useTheme } from "@emotion/react";
import KeyboardBackspaceTwoToneIcon from "@mui/icons-material/KeyboardBackspaceTwoTone";
import { Box, Button, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authContext } from "../../App";
import axiosInstance from "../../api";
import CustomSnackbar from "../alerts/CustomSnackbar";

export default function CourseHeader({ title, started }) {
  const navigate = useNavigate();
  const { user } = useContext(authContext);
  const [notification, setNotification] = useState({});
  const theme = useTheme();
  const [success, setSuccess] = useState(false);

  const goBack = () => {
    navigate(-1);
  };

  const enroll = async () => {
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/courseEnrollment/register/${title}/${user.email}`
      );

      if (response.status === 201) {
        notification.message =
          "You have successfully enrolled to this course. Happy learning!";
        notification.severity = "success";
        setSuccess(true);
      }
    } catch (e) {
      if ((e.code = "ERR_NETWORK")) {
        notification.message = "Network error occurred. Please try again.";
        notification.severity = "error";
      }
      if (!e.response) {
        notification.message = "Unknown error. Please try again later";
        notification.severity = "error";
      } else if (e.response) {
        notification.message = e.response.data.message;
        notification.severity = "error";
      }
    }

    setNotification(notification);
  };

  return (
    <>
      <Box
        sx={{
          borderBottom: "1px solid",
          borderBottomColor: "action.selected",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          component={Button}
          color="primary"
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            px: 0,
            width: "fit-content",
          }}
          onClick={goBack}
        >
          <KeyboardBackspaceTwoToneIcon />
          <Typography>Back to courses</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignContent: "center",
            [theme.breakpoints.down("lg")]: {
              fontSize: "3vw",
            },
          }}
        >
          <Box>
            <Typography
              gutterBottom
              variant="h4"
              sx={{
                [theme.breakpoints.down("lg")]: {
                  fontSize: "3vw",
                },
                [theme.breakpoints.down("sm")]: {
                  fontSize: "4vw",
                },
              }}
            >
              {title}
            </Typography>
          </Box>
          <Box>
            {!started && !success && (
              <Button color="primary" variant="contained" onClick={enroll}>
                Start
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {notification.message && (
        <CustomSnackbar
          notification={notification}
          setNotification={setNotification}
        />
      )}
    </>
  );
}
