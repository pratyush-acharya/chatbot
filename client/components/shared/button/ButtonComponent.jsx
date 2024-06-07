"use client";

import React from "react";

import Button from "@mui/material/Button";
import { CircularProgress, Tooltip } from "@mui/material";

const ButtonComponent = ({
  label,
  handlesubmit,
  loading,
  endIcon,
  disabled,
  tooltip,
  ...otherProps
}) => {
  return (
    <>
      <Tooltip title={tooltip}>
        <Button
          sx={{ color: "#fff" }}
          onClick={!loading ? handlesubmit : null}
          endIcon={endIcon}
          disabled={disabled}
          {...otherProps}
        >
          {loading ? (
            <CircularProgress color="secondary" size="1.8em" />
          ) : (
            label
          )}
        </Button>
      </Tooltip>
    </>
  );
};

export default ButtonComponent;
