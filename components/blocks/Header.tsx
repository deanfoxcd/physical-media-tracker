import { Link } from "@mui/material";
import localization from "@/locales/en";

export const Header = () => {
  return (
    <Link
      variant="h2"
      align="center"
      href="/"
      underline="none"
      sx={{ color: "black" }}
    >
      {localization.pageTitle}
    </Link>
  );
};
