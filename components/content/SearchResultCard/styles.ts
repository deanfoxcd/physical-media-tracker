import { SxProps } from "@mui/material";

export const titleTextLinkSX: SxProps = {
  whiteSpace: "normal",
  textAlign: "left",
  justifyContent: "flex-start",
};

export const mainStackSX: SxProps = { flex: 1, minWidth: 0 };

export const innerStackSX: SxProps = {
  alignItems: "flex-start",
  justifyContent: { xs: "flex-start", sm: "space-between" },
  flexWrap: "wrap",
};

export const iconsStackSX: SxProps = {
  alignItems: "center",
};

export const buttonsStackSX: SxProps = {
  flexWrap: "wrap",
};

export const textSX: SxProps = {
  color: "text.secondary",
};

export const resultTextSX: SxProps = { wordBreak: "break-word" };
