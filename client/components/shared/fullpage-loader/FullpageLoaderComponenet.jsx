import React from "react";

import { Backdrop } from "@mui/material";
import { CircleLoader } from "react-spinners";

const FullpageLoaderComponenet = ({ open }) => {
  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        // onClick={handleClose}
      >
        <CircleLoader color="#08244a" />
      </Backdrop>
    </>
  );
};

export default FullpageLoaderComponenet;
