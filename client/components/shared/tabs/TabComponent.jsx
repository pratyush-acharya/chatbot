import * as React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const TabComponent = ({ width, handlechange, label, value }) => {
  return (
    <Box sx={{ width: { width } }}>
      <Tabs value={value} onClick={handlechange}>
        <Tab label={label} />
      </Tabs>
    </Box>
  );
};
export default TabComponent;
