import React from "react";

import { Autocomplete, Box, TextField } from "@mui/material";

const AutoCompleteComponent = ({ label, value, handlechange, options }) => {
  return (
    <>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => handlechange(newValue)}
        id="controllable-states-demo"
        options={options.map((option) => option.name)}
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label={label} size="small" fullWidth />
        )}
      />
    </>
  );
};

export default AutoCompleteComponent;
