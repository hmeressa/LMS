import VisibilityOffTwoToneIcon from "@mui/icons-material/VisibilityOffTwoTone";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import axiosInstance from "../../../api";

export default function SetNewPassword({ handleNext, email }) {
  const [error, setError] = useState();
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleRepeat, setVisibleRepeat] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get("password").length < 8) {
      setError("Password must be at least 4 characters");
      return;
    }

    if (data.get("repeat_passwd") !== data.get("password")) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = axiosInstance.patch(
        `${process.env.REACT_APP_API_URL}/auth/resetPassword`,
        {
          email: email,
          newPassword: data.get("password"),
        }
      );

      setError(null);
      handleNext();
    } catch (e) {
      if (e.response.status === 404) {
        setError("There is no account associated with email address.");
      }
    }
  };
  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mx: "auto",
        }}>
        <Box>
          <Typography>Set a new password</Typography>
        </Box>

        {/* error display area */}
        {error && (
          <Alert sx={{ width: "100%" }} severity="error">
            {error}
          </Alert>
        )}
        <TextField
          id="password"
          name="password"
          type={visiblePassword ? "text" : "password"}
          label="Password"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => setVisiblePassword(!visiblePassword)}>
                  {visiblePassword ? (
                    <VisibilityOffTwoToneIcon />
                  ) : (
                    <VisibilityTwoToneIcon />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          id="repeat_passwd"
          name="repeat_passwd"
          type={visibleRepeat ? "text" : "password"}
          label="Repeat password"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => setVisibleRepeat(!visibleRepeat)}>
                  {visibleRepeat ? (
                    <VisibilityOffTwoToneIcon />
                  ) : (
                    <VisibilityTwoToneIcon />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "end",
            gap: 2,
          }}>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Box>
      </Box>
    </>
  );
}
