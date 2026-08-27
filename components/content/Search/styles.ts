import { SxProps, Theme } from "@mui/material";

export const mainStackSX: SxProps = {
  width: "100%",
  maxWidth: "700px",
  alignSelf: "center",
};

export const popperSX: SxProps<Theme> = (theme) => ({
  zIndex: theme.zIndex.appBar,
});

export const paperSX: SxProps = { p: 1, maxHeight: 500, overflowY: "auto" };
