import { Card, CardContent } from "@mui/material";
import React from "react";

const CardLayout = ({ children, width, backgroundColor, margin }) => {
  return (
    <Card
      sx={{
        margin: margin ? margin : "auto",
        width: width,
        backgroundColor: backgroundColor ? backgroundColor : "#fff",
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
      }}
    >
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default CardLayout;
