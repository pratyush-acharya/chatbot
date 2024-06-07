import { OutlinedInput, Typography, Box } from "@mui/material";
import React from "react";

const NonlabelledTextfieldComponent = ({ label, value }) => {
  return (
    <Box display="flex" gap="10px" flexDirection="column">
      <Typography variant="span" fontWeight="bold">
        {label}
      </Typography>
      <OutlinedInput disabled="isDisabled" value={value} size="small" />
    </Box>
  );
};
export default NonlabelledTextfieldComponent;
