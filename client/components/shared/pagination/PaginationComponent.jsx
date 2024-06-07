import React from "react";

import { Box, Typography } from "@mui/material";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import IconButtonComponent from "../icon-button/IconButtonComponent";

const PaginationComponent = ({
  currentPage,
  totalPage,
  handleNextPage,
  handlePreviousPage,
}) => {
  return (
    <Box display="flex" alignItems="center">
      <Typography>
        Page {currentPage} of {totalPage === 0 ? 1 : totalPage}
      </Typography>
      <IconButtonComponent
        onClick={handlePreviousPage}
        disabled={currentPage <= 1}
      >
        <NavigateBefore />
      </IconButtonComponent>
      <IconButtonComponent
        onClick={handleNextPage}
        disabled={currentPage >= totalPage}
      >
        <NavigateNext />
      </IconButtonComponent>
    </Box>
  );
};

export default PaginationComponent;
