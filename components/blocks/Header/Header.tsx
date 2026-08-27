"use client";

import { useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import localization from "@/locales/en";
import { useAuth } from "@/contexts/AuthContext";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  dialogBoxSX,
  emailTextSX,
  logoutIconSX,
  mainBoxSX,
  pageTitleSX,
  profileIconBoxSX,
  signedInTextSX,
} from "./styles";

interface HeaderProps {
  signOut?: boolean;
}

export const Header = ({ signOut }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  function handleLogout() {
    setAnchorEl(null);
    logout();
  }

  return (
    <Box sx={mainBoxSX}>
      <Link variant="h2" href="/" underline="none" sx={pageTitleSX}>
        {localization.pageTitle}
      </Link>
      {signOut && (
        <Box sx={profileIconBoxSX}>
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            aria-label="Profile"
          >
            <AccountCircleIcon fontSize="large" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <Box sx={dialogBoxSX}>
              <Typography variant="body2" sx={signedInTextSX}>
                Signed in as
              </Typography>
              <Typography variant="body2" sx={emailTextSX}>
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={logoutIconSX} />
              Sign Out
            </MenuItem>
          </Menu>
        </Box>
      )}
    </Box>
  );
};
