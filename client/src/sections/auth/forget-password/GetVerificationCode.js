import {
  Alert,
  Box,
  Button,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import axiosInstance from "../../../api";

export default function GetVerificationCode({
  email,
  handleNext,
  handleBack,
  setVerificationCode,
}) {
  const [error, setError] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get("code").length !== 8) {
      setError("Please enter a valid code");
      return;
    }

    try {
      const jsonData = Object.fromEntries(data.entries());
      jsonData.email = email;
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/auth/isValidCode`,
        jsonData
      );
      if (response.status === 202) {
        setError(null);
        setVerificationCode(data.get("code"));
        localStorage.setItem("token", response.data.token);
        handleNext();
      }
    } catch (e) {
      setError("Invalid code, please try again");
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
        <Stack spacing={2}>
          <Typography>
            If there is an account with this email we will send a verification
            code. Check your email and enter the verification code.
          </Typography>
          <Typography variant="subtitle2" color="info">
            It might take a minute for the code to arrive.
          </Typography>
        </Stack>

        {/* error display area */}
        {error && (
          <Alert sx={{ width: "100%" }} severity="error">
            {error}
          </Alert>
        )}

        <TextField
          type="text"
          variant="outlined"
          id="code"
          name="code"
          label="Verification Code"
          autoFocus
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
            <Button variant="outlined" color="primary" onClick={handleBack}>
              Back
            </Button>
          </Link>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Box>
      </Box>
    </>
  );
}
