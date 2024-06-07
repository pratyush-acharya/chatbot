import { IconButton } from "@mui/material";
import React from "react";

const IconButtonComponent = ({ children, color, ...otherParameters }) => {
  return (
    <>
      <IconButton color={color} {...otherParameters}>
        {children}
      </IconButton>
    </>
  );
};

export default IconButtonComponent;
