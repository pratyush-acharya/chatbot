import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@mui/material";
import React from "react";

const GroupCheckBox = ({ label, checkboxData, handleChange }) => {
  return (
    <FormControl component="fieldset" variant="standard">
      <FormLabel component="legend">{label}</FormLabel>
      <FormGroup
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "5px",
          justifyContent: "center",
        }}
      >
        {checkboxData?.map((data) => {
          return (
            <FormControlLabel
              key={data?.name}
              control={
                <Checkbox
                  checked={data?.value}
                  onChange={handleChange}
                  name={data?.name}
                />
              }
              label={data?.label}
            />
          );
        })}
      </FormGroup>
    </FormControl>
  );
};

export default GroupCheckBox;
