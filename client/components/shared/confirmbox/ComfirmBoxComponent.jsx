import React from "react";
import { Box, Modal, Typography } from "@mui/material";

const ConfirmBoxComponent = ({
  open,
  handleClose,
  title,
  description,
  children,
  width,
}) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: width,
    bgcolor: "background.paper",
    border: "none",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        title={title}
        description={description}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}> {children}</Box>
      </Modal>
    </>
  );
};

export default ConfirmBoxComponent;
