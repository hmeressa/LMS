import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone";
import { Alert, IconButton, Slide, Snackbar } from "@mui/material";
import React from "react";

export default function CustomSnackbar({ notification, setNotification }) {
  const handleClose = () => {
    setNotification({});
  };

  const action = (
    <React.Fragment>
      <IconButton color="inherit" onClick={handleClose}>
        <CloseTwoToneIcon />
      </IconButton>
    </React.Fragment>
  );

  function SlideTransition(props) {
    return <Slide {...props} direction="up" />;
  }

  return (
    <Snackbar
      open={notification.message !== undefined}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      action={action}
      TransitionComponent={SlideTransition}>
      <Alert
        onClose={handleClose}
        severity={notification.severity}
        sx={{ width: "100%" }}>
        {notification.message}
      </Alert>
    </Snackbar>
  );
}
