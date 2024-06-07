import * as React from "react";
import TextField from "@mui/material/TextField";
import { FormControl, InputLabel, MenuItem, Select, Box } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { id } from "date-fns/locale";
const AutoFieldComplete = ({
  label,
  options,
  width,
  value,
  name,
  handlechange,
  error,
  helperText,
  ...otherProps
}) => {
  // console.log("options value", value);
  // const handleIdChange = (value) => {
  //   const filtered = options.filter((option) => option.name);
  //   console.log("filtered value", filtered);
  //   if (filtered == value) {
  //     return filtered.id;
  //   }
  // };
  // handleIdChange();
  // console.log("options", options);
  return (
    <>
      <Autocomplete
        id="combo-box-demo"
        sx={{ width: 300 }}
        // options={options.map((option) => option?.name)}
        options={options?.map((option) => option.name)}
        value={value}
        // getOptionLabel={options.map((option) => option.name)}
        onChange={(event, newValue) => handlechange(newValue)}
        // getOptionValue={(options) => console.log(options.id) }
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            label={label}
            error={error}
            helperText={helperText}
          />
        )}
      />
    </>
  );
};
export default AutoFieldComplete;
