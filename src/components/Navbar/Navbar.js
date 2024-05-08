import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";

const AvatarProfile = ({ userData, onAvatarClick }) => {
  // Get initials for the avatar
  const initials = userData
    ? userData.firstName[0].toUpperCase() + userData.lastName[0].toUpperCase()
    : "";

  return (
    <Avatar onClick={onAvatarClick} sx={{ cursor: "pointer" }}>
      {initials}
    </Avatar>
  );
};

export default function ButtonAppBar() {
  const [isLogged, setIsLogged] = useState(localStorage.getItem("isLoggedIn"));
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    setIsLogged(isLoggedIn);
  }, [location.pathname, isLogged]);
  
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("isLoggedIn");
    setAnchorEl(null);
    navigate("/login");
  };

  const userDataString = localStorage.getItem("userData");
  let userData = null;

  if (userDataString) {
    userData = JSON.parse(userDataString);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SplitWise Clone
          </Typography>
          {isLogged ? (
            <>
              <AvatarProfile
                userData={userData}
                onAvatarClick={handleAvatarClick}
              />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Stack spacing={2} direction="row">
              <Button variant="outlined" color="inherit">
                <Link
                  style={{ color: "white", textDecoration: "none" }}
                  to="/login"
                >
                  Login
                </Link>
              </Button>
              <Button variant="outlined" color="inherit">
                <Link
                  style={{ color: "white", textDecoration: "none" }}
                  to="/signup"
                >
                  Sign Up
                </Link>
              </Button>
            </Stack>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
