import { useTheme } from "@emotion/react";
import EmailTwoToneIcon from "@mui/icons-material/EmailTwoTone";
import FingerprintTwoToneIcon from "@mui/icons-material/FingerprintTwoTone";
import PasswordTwoToneIcon from "@mui/icons-material/PasswordTwoTone";
import {
  Box,
  Button,
  Card,
  CardContent,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import LoginPageSideImage from "../LoginPageSideImage";
import GetEmail from "./GetEmail";
import GetVerificationCode from "./GetVerificationCode";
import SetNewPassword from "./SetNewPassword";

const steps = [
  { label: "Enter your email address", icon: <EmailTwoToneIcon /> },
  { label: "Enter the verification code", icon: <FingerprintTwoToneIcon /> },
  { label: "Set new password", icon: <PasswordTwoToneIcon /> },
];

export default function ForgetPassword() {
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const theme = useTheme();

  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  const getActiveStep = (step) => {
    switch (step) {
      case 0:
        return <GetEmail handleNext={handleNext} setEmail={setEmail} />;
      case 1:
        return (
          <GetVerificationCode
            email={email}
            handleNext={handleNext}
            handleBack={handleBack}
            setVerificationCode={setVerificationCode}
          />
        );
      case 2:
        return <SetNewPassword handleNext={handleNext} email={email} />;
      default:
        return <></>;
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
      <LoginPageSideImage />

      <Box
        sx={{
          width: "90%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: 4,
          justifyContent: "center",
          height: "100vh",
        }}>
        <Card
          sx={{
            [theme.breakpoints.up("lg")]: {
              boxShadow: "none",
              background: "transparent",
              width: "70%",
            },
          }}>
          <CardContent sx={{ m: 2 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map(({ label, icon }) => {
                return (
                  <Step key={label}>
                    <StepLabel icon={icon}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === steps.length ? (
              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}>
                <Typography variant="h6">
                  Your new password has been set.
                </Typography>
                <Link to="/login">
                  <Button>Back to login</Button>
                </Link>
              </Box>
            ) : (
              <Box sx={{ mt: 4 }}>{getActiveStep(activeStep)}</Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
