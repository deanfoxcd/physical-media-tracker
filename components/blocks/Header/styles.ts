import { SxProps } from "@mui/material";

export const dialogBoxSX: SxProps = { px: 2, py: 1 };

export const emailTextSX: SxProps = { wordBreak: "break-all" };

export const logoutIconSX: SxProps = { mr: 1 };

export const mainBoxSX: SxProps = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr auto", sm: "1fr auto 1fr" },
  alignItems: "center",
};

export const pageTitleSX: SxProps = {
  color: "black",
  fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3.75rem" },
  gridColumn: { xs: "1", sm: "2" },
  justifySelf: { xs: "start", sm: "center" },
};

export const profileIconBoxSX: SxProps = {
  gridColumn: { xs: "2", sm: "3" },
  justifySelf: "end",
};

export const signedInTextSX: SxProps = { color: "text.secondary" };
