import { useTheme } from "@emotion/react";
import SaveTwoToneIcon from "@mui/icons-material/SaveTwoTone";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { authContext } from "../../App";
import axiosInstance from "../../api";
import CustomSnackbar from "../../components/alerts/CustomSnackbar";
import { EMAIL_REGEX, PHONE_REGEX } from "../../utils/constants";

export default function ProfileSettings({ canEdit }) {
  const { user, getUserData } = useContext(authContext);
  const [changed, setChanged] = useState(false);
  const [newFirstName, setNewFirstName] = useState(null);
  const [newLastName, setNewLastName] = useState(null);
  const [newGender, setNewGender] = useState(null);
  const [newEmail, setNewEmail] = useState(null);
  const [newPhone, setNewPhone] = useState(null);
  const [error, setError] = useState();
  const [notification, setNotification] = useState({});
  const theme = useTheme();

  const handleFirstNameChange = (e) => {
    setNewFirstName(e.target.value);
    setChanged(true);
  };

  const handleLastNameChange = (e) => {
    setNewLastName(e.target.value);
    setChanged(true);
  };

  const handleGenderChange = (e) => {
    setNewGender(e.target.value);
    setChanged(true);
  };

  const handleEmailChange = (e) => {
    setNewEmail(e.target.value);
    setChanged(true);
  };

  const handlePhoneChange = (e) => {
    setNewPhone(e.target.value);
    setChanged(true);
  };

  const validateUser = () => {
    if (newEmail && !EMAIL_REGEX.test(newEmail)) {
      setError("Invalid email address");
      return false;
    } else if (user.phone === null && newPhone === null) {
      setError("invalid phone number");
      return false;
    } else if (newPhone && !PHONE_REGEX.test(newPhone)) {
      setError("invalid phone number");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSave = async () => {
    const isValid = validateUser();

    if (isValid) {
      try {
        const response = await axiosInstance.put(
          `${process.env.REACT_APP_API_URL}/user/updateOne/${user.id}`,
          {
            id: user.id,
            firstName: newFirstName || user.firstName,
            lastName: newLastName || user.lastName,
            email: newEmail || user.email,
            phone: newPhone || user.phone,
            gender: newGender || user.gender.toLowerCase(),
          }
        );

        if (response.status === 200) {
          getUserData();
          notification.message = "Profile updated successfully";
          notification.severity = "success";
        }
      } catch (e) {
        notification.message = "Failed to update profile. Please try again";
        notification.severity = "error";
      }

      setNotification(notification);
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
        <CardHeader subheader="Profile Info" />
        <CardContent
          sx={{
            display: "flex",
            gap: 4,
            flexDirection: "column",
          }}>
          <Box sx={{ mb: 1 }}>
            {error && (
              <Alert sx={{ width: "100%" }} severity="error">
                {error}
              </Alert>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 4,
              flexDirection: "row",
              [theme.breakpoints.down("md")]: {
                flexDirection: "column",
              },
            }}>
            <Box
              sx={{
                width: "35%",
                [theme.breakpoints.down("md")]: {
                  width: "100%",
                },
              }}>
              <Typography gutterBottom color="text.secondary">
                First Name
              </Typography>
              <TextField
                disabled={!canEdit}
                defaultValue={user && user.firstName}
                fullWidth
                onChange={handleFirstNameChange}
              />
            </Box>
            <Box
              sx={{
                width: "35%",
                [theme.breakpoints.down("md")]: {
                  width: "100%",
                },
              }}>
              <Typography gutterBottom color="text.secondary">
                Last Name
              </Typography>
              <TextField
                disabled={!canEdit}
                defaultValue={user && user.lastName}
                fullWidth
                onChange={handleLastNameChange}
              />
            </Box>
            <Box>
              <Typography gutterBottom color="text.secondary">
                Gender
              </Typography>
              <Select
                disabled={!canEdit}
                defaultValue={user && user.gender.toLowerCase()}
                onChange={handleGenderChange}>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 4,
              flexDirection: "row",
              [theme.breakpoints.down("md")]: {
                flexDirection: "column",
              },
            }}>
            <Box
              sx={{
                width: "35%",
                [theme.breakpoints.down("md")]: {
                  width: "100%",
                },
              }}>
              <Typography gutterBottom color="text.secondary">
                Email
              </Typography>
              <TextField
                disabled={!canEdit}
                defaultValue={user && user.email}
                fullWidth
                onChange={handleEmailChange}
              />
            </Box>
            <Box
              sx={{
                width: "35%",
                [theme.breakpoints.down("md")]: {
                  width: "100%",
                },
              }}>
              <Typography gutterBottom color="text.secondary">
                Phone
              </Typography>
              <TextField
                disabled={!canEdit}
                defaultValue={user && user.phone}
                fullWidth
                onChange={handlePhoneChange}
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 4,
              flexDirection: "row",
              [theme.breakpoints.down("md")]: {
                flexDirection: "column",
              },
            }}>
            <Tooltip title="You cannot modify this field. If there is a mistake contact the system admin or the human resource manager.">
              <Box
                sx={{
                  width: "35%",
                  [theme.breakpoints.down("md")]: {
                    width: "100%",
                  },
                }}>
                <Typography gutterBottom color="text.secondary">
                  Position
                </Typography>
                <TextField
                  defaultValue={user && user.position}
                  fullWidth
                  disabled
                />
              </Box>
            </Tooltip>
            <Tooltip title="You cannot modify this field. If there is a mistake contact the system admin or the human resource manager.">
              <Box
                sx={{
                  width: "35%",
                  [theme.breakpoints.down("md")]: {
                    width: "100%",
                  },
                }}>
                <Typography gutterBottom color="text.secondary">
                  Team
                </Typography>
                <TextField
                  defaultValue={user && user.team.teamName}
                  fullWidth
                  disabled
                />
              </Box>
            </Tooltip>
          </Box>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            startIcon={<SaveTwoToneIcon />}
            disabled={changed ? false : true}
            onClick={handleSave}>
            Save changes
          </Button>
          <Button disabled={changed ? false : true}>Cancel</Button>
        </CardActions>
      </Card>
    </>
  );
}
