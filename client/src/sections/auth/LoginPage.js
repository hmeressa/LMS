import { useTheme } from "@emotion/react";
import CopyrightTwoToneIcon from "@mui/icons-material/CopyrightTwoTone";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import VisibilityOffTwoToneIcon from "@mui/icons-material/VisibilityOffTwoTone";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import {
  Alert,
  Box,
  Button,
  Card,
  Link as Goto,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { EMAIL_REGEX } from "../../utils/constants";
import LoginPageSideImage from "./LoginPageSideImage";

export default function Login({ handleLogin }) {
  const [error, setError] = useState();
  const [visible, setVisible] = useState(false);
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    if (!EMAIL_REGEX.test(data.get("email"))) {
      setError("Invalid email address");
      return;
    }
    if (data.get("password").length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      const jsonData = Object.fromEntries(data.entries());
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/signin`,
        jsonData
      );
      if (response.status === 202) {
        localStorage.setItem("id", response.data.id);
        localStorage.setItem("token", response.data.token);
        handleLogin();

        setError(null);
      }
    } catch (e) {
      if (e.code === "ERR_NETWORK") {
        setError("There is a network issue. Please try again.");
      } else if (e.response.status === 404) {
        setError("There is no account associated with this email address");
      } else if (e.response.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("Unknown error occurred. Please try again.");
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        minHeight: "100vh",
        [theme.breakpoints.down("lg")]: {
          justifyContent: "center",
        },
      }}>
      {/* Side image */}
      <LoginPageSideImage />

      {/* Login form */}
      <Box
        sx={{
          width: "50%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: 4,
          justifyContent: "center",
          height: "100vh",
        }}>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 2,
            py: 2,
            px: 4,
            width: 400,
            [theme.breakpoints.up("lg")]: {
              boxShadow: "none",
              background: "transparent",
            },
          }}>
          <img
            width={56}
            src="/assets/logo.png"
            alt="IE Network Solutions logo"
            style={{ alignSelf: "center", marginBottom: 8 }}
          />
          <Box>
            <Typography variant="h5">Login</Typography>
            <Typography variant="subtitle2" sx={{ display: "inline" }}>
              Please fill your detail to access your account.
            </Typography>
            <Tooltip
              style={{ color: "red" }}
              title={
                <Typography>
                  Use thee default accounts{" "}
                  <strong>user.admin@test.com - user.admin</strong> and
                  <strong>user.member@test.com - user.member</strong> if you are
                  testing
                </Typography>
              }>
              *
            </Tooltip>
          </Box>

          {/* error display area */}
          {error && (
            <Alert sx={{ width: "100%" }} severity="error">
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
            }}>
            <TextField
              variant="outlined"
              id="email"
              name="email"
              label="Email"
              autoComplete="email"
              autoFocus={true}
              fullWidth={true}
              placeholder="Email"
              required
            />
            <TextField
              id="password"
              name="password"
              type={visible ? "text" : "password"}
              label="Password"
              placeholder="Password"
              fullWidth
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => setVisible(!visible)}>
                      {visible ? (
                        <VisibilityOffTwoToneIcon />
                      ) : (
                        <VisibilityTwoToneIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              LOGIN
            </Button>
            <Link
              to="/forget-password"
              style={{ alignSelf: "end", width: "fit-content" }}>
              <Button color="error">Forgot Password?</Button>
            </Link>
          </Box>
        </Card>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CopyrightTwoToneIcon /> IE Network Solutions
        </Box>
      </Box>

      {/* Fixed info section at the bottom */}
      <Box
        sx={{
          position: "fixed",
          display: "flex",
          gap: 1,
          alignItems: "center",
          left: 0,
          bottom: 0,
          px: 4,
          py: 2,
          fontSize: ".9rem",
          lineHeight: 1.2,
          width: "50vw",
          [theme.breakpoints.down("lg")]: {
            width: "100vw",
          },
        }}>
        <InfoTwoToneIcon fontSize="small" />
        <Box>
          This site was developed by ashenafiDL (
          <Goto
            color="secondary"
            href="https://github.com/ashenafidl"
            target="_blank"
            rel="noopener noreferrer">
            GitHub
          </Goto>
          ,{" "}
          <Goto
            color="secondary"
            href="https://linkedin/in/ashenafidl"
            target="_blank"
            rel="noopener noreferrer">
            LinkedIn
          </Goto>
          ) and Belay Birhanu (
          <Goto
            color="secondary"
            href="https://github.com/adgehTech"
            target="_blank"
            rel="noopener noreferrer">
            GitHub
          </Goto>
          ,{" "}
          <Goto
            color="secondary"
            href="https://linkedin/in/belay-birhanu"
            target="_blank"
            rel="noopener noreferrer">
            LinkedIn
          </Goto>
          ) as part of their internship project.
        </Box>
      </Box>
    </Box>
  );
}
