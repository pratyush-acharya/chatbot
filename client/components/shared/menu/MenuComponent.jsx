import React from "react";
import Router from "next/router";
import Link from "next/link";
import { useRouter } from "next/router";

import { pages } from "../../../data/routes";

import {
  Button,
  Menu,
  MenuItem,
  Typography,
  Box,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";

const MenuComponent = ({ menuItem, menuIndex }) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // nested routes
  const [nestedAnchorEl, setNestedAnchorEl] = React.useState(null);
  const openNested = Boolean(nestedAnchorEl);

  const handleItemClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNestedItemClick = (event) =>
    setNestedAnchorEl(event.currentTarget);

  const handleClose = () => {
    setAnchorEl(null);
    setNestedAnchorEl(null);
  };

  return (
    <Box key={menuIndex}>
      {menuItem.items ? (
        <Box key={menuIndex}>
          <Button
            size="small"
            color="primary"
            sx={{
              color: "black",
              display: "block",
              textTransform: "none",
              fontSize: "13px",
              display: "flex",
            }}
            onClick={handleItemClick}
            endIcon={<ArrowDropDown />}
          >
            {menuItem.name}
          </Button>
          <Menu
            // id={`basic-menu-${index}`}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {menuItem.items.map((item, itemIndex) =>
              !item.items ? (
                <MenuItem
                  key={itemIndex}
                  onClick={() => {
                    router.push(item.path);
                    handleClose();
                  }}
                >
                  {item.name}
                </MenuItem>
              ) : (
                <Box key={itemIndex}>
                  <Box
                    display="flex"
                    alignItems="center"
                    padding="8px 17px"
                    sx={{ cursor: "pointer" }}
                    onClick={handleNestedItemClick}
                  >
                    <Typography fontSize="18px" fontWeight="400" variant="span">
                      {item.name}
                    </Typography>
                    <ArrowDropDown />
                  </Box>
                  <Menu
                    anchorEl={nestedAnchorEl}
                    open={openNested}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    {item.items.map((nestedItem, nestedItemIndex) => (
                      <MenuItem
                        key={nestedItemIndex}
                        onClick={() => {
                          router.push(nestedItem.path);
                          handleClose();
                        }}
                      >
                        {nestedItem.name}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              )
            )}
          </Menu>
        </Box>
      ) : (
        <Button
          onClick={() => {
            router.push(menuItem.path);
            handleClose();
          }}
          size="small"
          color="primary"
          sx={{
            color: "black",
            display: "block",
            textTransform: "none",
            fontSize: "13px",
          }}
        >
          {menuItem.name}
        </Button>
      )}
    </Box>
  );
};

export default MenuComponent;
