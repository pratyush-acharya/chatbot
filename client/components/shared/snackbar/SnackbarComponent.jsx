import React from "react";

import { Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";

const SnackbarComponent = ({ open, handleClose, data }) => {
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={data?.severity}
          sx={{ width: "100%" }}
        >
          {data?.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SnackbarComponent;
