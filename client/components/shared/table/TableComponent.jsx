"use client";

import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";

const TableComponent = ({
  columns,
  rows,
  id,
  height,
  checkboxSelection,
  disableSelectionOnClick,
  onRowClick,
  onSelectionModelChange,
  maxHeight,
  pageSize,
  paginationModel,
  setPaginationModel,
  ...otherProps
}) => {
  return (
    <>
      <Box
        display="flex"
        height={height ? height : "57vh"}
        maxHeight={maxHeight ? maxHeight : "60vh"}
      >
        <Box flexGrow="1">
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(rows = rows[id])}
            pageSize={pageSize}
            checkboxSelection={checkboxSelection}
            disableSelectionOnClick={disableSelectionOnClick}
            rowsPerPageOptions={[5]}
            onRowClick={onRowClick}
            disableColumnSelector
            onSelectionModelChange={onSelectionModelChange}
            {...otherProps}
            hideFooter
          />
        </Box>
      </Box>
    </>
  );
};

export default TableComponent;
