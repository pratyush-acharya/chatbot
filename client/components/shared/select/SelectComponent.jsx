import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

const SelectComponent = ({
  size,
  label,
  value,
  error,
  helperText,
  handlechange,
  fullWidth,
  options,
  width,
  ...otherProps
}) => {
  return (
    <>
      <FormControl size={size} sx={{ width: width }}>
        <InputLabel id="custom-select">{label}</InputLabel>
        <Select
          id="mui-select"
          value={value}
          onChange={handlechange}
          error={error}
          helperText={helperText}
          label={label}
          fullWidth
          {...otherProps}
        >
          {options?.map((option) => {
            return (
              <MenuItem key={option?.id} value={option?.id}>
                {option?.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </>
  );
};

export default SelectComponent;
