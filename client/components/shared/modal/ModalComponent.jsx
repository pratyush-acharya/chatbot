import React from "react";
import { Box, Modal, Typography } from "@mui/material";

const ModalComponent = ({ open, handleClose, children, width, className }) => {
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
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className={className}
      >
        <Box sx={style}>{children}</Box>
      </Modal>
    </>
  );
};

export default ModalComponent;
