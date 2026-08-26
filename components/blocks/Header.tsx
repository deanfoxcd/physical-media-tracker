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
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr auto", sm: "1fr auto 1fr" },
        alignItems: "center",
      }}
    >
      <Link
        variant="h2"
        href="/"
        underline="none"
        sx={{
          color: "black",
          fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3.75rem" },
          gridColumn: { xs: "1", sm: "2" },
          justifySelf: { xs: "start", sm: "center" },
        }}
      >
        {localization.pageTitle}
      </Link>
      {signOut && (
        <Box
          sx={{
            gridColumn: { xs: "2", sm: "3" },
            justifySelf: "end",
          }}
        >
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
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Signed in as
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Sign Out
            </MenuItem>
          </Menu>
        </Box>
      )}
    </Box>
  );
};
