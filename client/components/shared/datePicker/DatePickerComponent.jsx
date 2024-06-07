import React from "react";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { TextField } from "@mui/material";

const DatePickerComponent = ({
  label,
  value,
  handlechange,
  name,
  fullWidth,
  maxDate,
  ...otherProps
}) => {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DesktopDatePicker
          label={label}
          value={value}
          name={name}
          maxDate={maxDate}
          onChange={(newValue) => {
            handlechange(newValue);
          }}
          renderInput={(params) => (
            <TextField fullWidth={fullWidth} size="small" {...params} />
          )}
          disableFuture
          {...otherProps}
        />
      </LocalizationProvider>
    </>
  );
};

export default DatePickerComponent;
