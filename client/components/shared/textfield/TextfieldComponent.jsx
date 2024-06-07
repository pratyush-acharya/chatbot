import React from "react";

import { Box, TextField } from "@mui/material";

const TextfieldComponent = ({
  label,
  name,
  value,
  type,
  handlechange,
  handlesubmit,
  width,
  placeholder,
  helperText,
  error,
  required,
  ...otherProps
}) => {
  return (
    <Box
      component="form"
      // sx={{
      //   margin: "0.5em 0",
      // }}
      noValidate
      autoComplete="off"
      width={width}
    >
      <TextField
        required={required}
        error={error}
        id="textfield"
        label={label}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        // variant="outlined"
        onChange={handlechange}
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            handlesubmit();
          }
        }}
        helperText={helperText}
        {...otherProps}
      />
    </Box>
  );
};

export default TextfieldComponent;
