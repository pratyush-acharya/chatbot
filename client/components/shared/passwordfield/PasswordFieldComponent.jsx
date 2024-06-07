import React, { useState } from "react";

import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const PasswordFieldComponent = ({
  label,
  handlechange,
  handlesubmit,
  fullWidth,
  ...otherProps
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  return (
    <Box
      component="form"
      // sx={{
      //   margin: "1.5em 0",
      // }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="password"
        label={label}
        variant="outlined"
        onChange={handlechange}
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            handlesubmit();
          }
        }}
        type={showPassword ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...otherProps}
      />
    </Box>
  );
};

export default PasswordFieldComponent;
