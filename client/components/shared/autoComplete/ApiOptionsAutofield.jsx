import { Autocomplete, TextField } from "@mui/material";
import React from "react";

const ApiOptionsAutofield = ({
  loading,
  optionData,
  value,
  handleOptionSelect,
  label,
}) => {
  return (
    <Autocomplete
      loading={loading}
      open={optionData ? true : false}
      id="controllable-states-demo"
      options={optionData}
      getOptionLabel={(option) => option?.name}
      sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          size="small"
          value={value}
          onChange={handleOptionSelect}
          fullWidth
        />
      )}
      onChange={(event, newValue) => handleOptionSelect(event, newValue)}
    />
  );
};

export default ApiOptionsAutofield;
