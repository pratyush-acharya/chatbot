import React from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { id } from "date-fns/locale";

const RadioButtonComponent = ({
  label,
  handlechange,
  radioValue,
  radioButtonName,
  name,
  ...otherProps
}) => {
  return (
    <FormControl>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name={name}
        value={radioValue}
        onChange={handlechange}
      >
        <Box display={"flex"}>
          {radioButtonName.map((input, index) => (
            <>
              <FormControlLabel
                //key={index}
                value={input}
                control={<Radio />}
                label={input}
              />
            </>
          ))}
        </Box>
      </RadioGroup>
    </FormControl>
  );
};

export default RadioButtonComponent;
