import React from "react";

import { Box,FormControl,FormControlLabel, InputLabel } from "@mui/material";

const LabelComponent = ({
    label,
    handlechange,
    handlesubmit,
    width,
    ...otherProps 
}
) => {
  return (
    <Box
      component="form"
      // sx={{
      //   margin: "0.5em 0",
      // }}
      noValidate
      autoComplete="off"
    //   width={width}
    >
        <FormControl
      
      >
          <FormControlLabel
            label={label}
            control={<InputLabel />}
            onChange={handlechange}
            {...otherProps}/>
      </FormControl>
    </Box>
  );
};

export default LabelComponent;
