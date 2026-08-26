import { Box, Link } from "@mui/material";
import localization from "@/locales/en";
import { ActionButton } from "./ActionButton";
import { useAuth } from "@/contexts/AuthContext";
import LogoutIcon from "@mui/icons-material/Logout";

interface HeaderProps {
  signOut?: boolean;
}

export const Header = ({ signOut }: HeaderProps) => {
  const { logout } = useAuth();
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr auto", sm: "1fr auto 1fr" },
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
            p: { xs: 0, sm: 1 },
          }}
        >
          <ActionButton
            minor
            onClick={logout}
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              whiteSpace: "nowrap",
            }}
          >
            Sign Out
          </ActionButton>
          <ActionButton
            minor
            onClick={logout}
            sx={{
              display: { xs: "inline-flex", sm: "none" },
              minWidth: 0,
              p: 1,
            }}
            aria-label="Sign Out"
          >
            <LogoutIcon fontSize="small" />
          </ActionButton>
        </Box>
      )}
    </Box>
  );
};
