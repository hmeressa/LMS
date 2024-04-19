import KeyboardBackspaceTwoToneIcon from "@mui/icons-material/KeyboardBackspaceTwoTone";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { EMAIL_REGEX } from "../../../utils/constants";

export default function GetEmail({ handleNext, setEmail }) {
  const [error, setError] = useState();
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!EMAIL_REGEX.test(data.get("email"))) {
      setError("Invalid email address");
      return;
    }

    try {
      const jsonData = Object.fromEntries(data.entries());
      setEmail(jsonData.email);
      setDisabled(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/forgotPassword`,
        jsonData
      );
      if (response.status === 202) {
        setError(null);
        setEmail(jsonData.email);
        handleNext();
      }
    } catch (e) {
      if (e.response.status === 404) {
        setError("There is no account associated with this email address");
        setDisabled(false);
        return;
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
          <Typography>
            No worries! We will send you password reset instructions
          </Typography>
        </Box>
        {/* error display area */}
        {error && (
          <Alert sx={{ width: "100%" }} severity="error">
            {error}
          </Alert>
        )}
        <TextField
          variant="outlined"
          id="email"
          name="email"
          label="Email"
          autoComplete="email"
          autoFocus
          placeholder="Email"
          required
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "end",
            gap: 2,
          }}>
          <Link to="/login">
            <Button variant="outlined" color="primary">
              <KeyboardBackspaceTwoToneIcon />
              Back to login
            </Button>
          </Link>
          <Button
            disabled={disabled}
            variant="contained"
            color="primary"
            type="submit">
            Submit
          </Button>
        </Box>
      </Box>
    </>
  );
}
