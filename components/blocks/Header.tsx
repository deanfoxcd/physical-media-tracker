import { Box, Link } from "@mui/material";
import localization from "@/locales/en";
import { ActionButton } from "./ActionButton";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  signOut?: boolean;
}

export const Header = ({ signOut }: HeaderProps) => {
  const { logout } = useAuth();
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
      }}
    >
      <Box />
      <Link
        variant="h2"
        align="center"
        href="/"
        underline="none"
        sx={{ color: "black" }}
      >
        {localization.pageTitle}
      </Link>
      {signOut && (
        <Box sx={{ justifySelf: "end" }}>
          <ActionButton minor onClick={logout} sx={{ whiteSpace: "nowrap" }}>
            Sign Out
          </ActionButton>
        </Box>
      )}
    </Box>
  );
};
