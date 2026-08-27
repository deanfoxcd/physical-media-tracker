import { SxProps, Theme } from "@mui/material";

export const paperSX: SxProps<Theme> = (theme) => ({
  position: "fixed",
  bottom: 16,
  left: "50%",
  transform: "translateX(-50%)",
  p: 2,
  zIndex: theme.zIndex.appBar,
  maxWidth: 500,
});

export const mainStackSX: SxProps = {
  alignItems: "center",
};
