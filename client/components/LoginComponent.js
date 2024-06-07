"use client";
import React, { useState } from "react";
import Image from "next/image";
import MainContainer from "./MainContainer";
import Router from "next/router";
// import styles from "@styles/main.css";
import globalstyles from "@styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

import {
  Box,
  Typography,
  Button,
  Grid,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";

import CardLayout from "./card-layout/CardLayout";
import TextfieldComponent from "./shared/textfield/TextfieldComponent";
import PasswordFieldComponent from "./shared/passwordfield/PasswordFieldComponent";
import ButtonComponent from "./shared/button/ButtonComponent";
import SnackbarComponent from "./shared/snackbar/SnackbarComponent";
import { useRouter } from "next/navigation";
import styles from "@styles/main.css";
import { Row, Container, Col, Stack } from "react-bootstrap";
import ConfigSideNav from "@components/ConfigSideNav";
import { ToastContainer, toast } from "react-toastify";

/**
 * A React functional component representing a login page.
 *
 * @returns {JSX.Element} A login page with input fields for username and password, and a button to submit the login credentials.
 * @param {Object} event - The event object representing a user's interaction with the input fields.
 */
const LoginComponent = () => {
  const router = useRouter();
  const [loginCredentials, setLoginCredentials] = useState({
    username: "",
    password: "",
  });

  const [snackbarData, setSnackbarData] = useState({
    show: false,
    severity: "error",
    message: "",
  });

  /**
   * Updates the login credentials state with the given event's input value for the input's name property.
   *
   * @param {Event} event - The input event that triggered the function.
   * @return {void} This function does not return anything.
   */
  const handleChange = (event) => {
    setLoginCredentials({
      ...loginCredentials,
      [event.target.name]: event.target.value,
    });
  };
  const [homePage, SetHomePage] = useState(false);
  /**
   * Handles the form submission for user login.
   *
   * @param {} No parameters needed.
   * @return {} No return value.
   */
  const handleSubmit = () => {
    const hashedPassword = Buffer.from(loginCredentials.password).toString(
      "base64"
    );
    if (loginCredentials.username?.length === 0) {
      setSnackbarData({
        show: true,
        severity: "error",
        message: "Please enter a valid username",
      });
    } else if (loginCredentials.password?.length === 0) {
      setSnackbarData({
        show: true,
        severity: "error",
        message: "Please enter the password",
      });
    } else {
      if (
        loginCredentials.username === "admin" &&
        loginCredentials.password === "admin"
      ) {
        localStorage.setItem("username", loginCredentials.username);
        localStorage.setItem("password", loginCredentials.password);
        // router.push("/Home");
        SetHomePage(true);
      } else {
        setSnackbarData({
          show: true,
          severity: "error",
          message: "Please enter valid login credentials",
        });
      }
    }
  };

  /**
   * Handles closing the snackbar.
   *
   * @return {void}
   */
  const handleSnackbarClose = () => {
    setSnackbarData({ ...snackbarData, show: false });
  };
  const handleLogout = () => {
    SetHomePage(false);
  };
  return (
    <>
      {homePage == false && (
        <>
          <SnackbarComponent
            data={snackbarData}
            open={snackbarData.show}
            handleClose={handleSnackbarClose}
          />
          <CardLayout>
            <Grid container display="flex" gap="20px" padding="1em">
              <Grid item display="flex" alignItems="center">
                {/* <Box textAlign="center">
              <Image
                src="/images/naasa-new-logo.png"
                alt="nasalogo"
                height="80"
                width="300"
              />
            </Box> */}
              </Grid>
              <Grid item margin="2em 0 2em 0" padding="0 2em">
                <Box display="flex" flexDirection="column">
                  <Typography
                    variant="h5"
                    fontSize="22px"
                    color="primary"
                    fontWeight="600"
                  >
                    Welcome to Naasa Securities
                  </Typography>
                  <Typography fontSize="14px" color="#999999">
                    Sign in to continue
                  </Typography>
                </Box>
                <Box>
                  <TextfieldComponent
                    label={"Username"}
                    fullWidth
                    name="username"
                    value={loginCredentials.username}
                    handlechange={handleChange}
                    handlesubmit={handleSubmit}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton aria-label="toggle password visibility">
                            <AccountCircle />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <PasswordFieldComponent
                    label={"Password"}
                    fullWidth
                    name="password"
                    value={loginCredentials.password}
                    handlechange={handleChange}
                    handlesubmit={handleSubmit}
                  />
                </Box>
                <Box>
                  <ButtonComponent
                    variant="contained"
                    handlesubmit={handleSubmit}
                    label={"Login"}
                    fullWidth
                  />
                </Box>
              </Grid>
            </Grid>
          </CardLayout>
        </>
      )}
      {homePage == true && (
        <>
          <MainContainer handleLogout={handleLogout} />
          <ToastContainer />
        </>
      )}
    </>
  );
};

export default LoginComponent;
