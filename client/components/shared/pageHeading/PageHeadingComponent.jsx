"use client";

import { Typography } from "@mui/material";
import React from "react";

const PageHeadingComponent = ({ title }) => {
  return (
    <Typography variant="span" color="primary" fontSize="26px" fontWeight="600">
      {title}
    </Typography>
  );
};

export default PageHeadingComponent;
