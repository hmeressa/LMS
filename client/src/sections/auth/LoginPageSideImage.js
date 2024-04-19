import { useTheme } from "@emotion/react";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import { Box, Link as Goto, Typography } from "@mui/material";

export default function LoginPageSideImage({ handleLogin }) {
  const theme = useTheme();

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
      <Box
        sx={{
          width: "50vw",
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.primary.light
              : theme.palette.primary.dark,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          [theme.breakpoints.down("lg")]: {
            display: "none",
          },
        }}>
        <img
          width={600}
          src="/assets/login-page-illustration.png"
          alt="IE Network Solutions logo"
          style={{ alignSelf: "center" }}
        />
        <Typography variant="h3" style={{ fontWeight: "bold" }}>
          Welcome to our website
        </Typography>
        <Typography variant="h5">Learning management system</Typography>
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
