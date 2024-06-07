import React from "react";

import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

const SingleRadioButtonComponent = ({
  checkedValue,
  handlechange,
  label,
  labelPlacement,
  name,
  disabled,
  value,
  defaultChecked,
  ...otherProps
}) => {
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Checkbox
          value={value}
            checked={checkedValue}
            defaultChecked={defaultChecked}
            onChange={handlechange}
          />
        }
        label={label}
        labelPlacement={labelPlacement}
        name={name}
        disabled={disabled}
      />
    </FormGroup>
  );
};

export default SingleRadioButtonComponent;
