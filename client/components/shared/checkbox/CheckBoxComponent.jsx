import { CheckBox } from "@mui/icons-material";
import { FormControlLabel, FormGroup } from "@mui/material";
import React from "react";
const CheckBoxComponent = ({
  label,
  handlechange,
  checkboxValue,
  checkboxName,
  name,
  ...otherProps
}) => {
  return (
    <FormGroup>
      <FormControlLabel control={<CheckBox />} label={label} />
    </FormGroup>
  );
};
export default CheckBoxComponent;
