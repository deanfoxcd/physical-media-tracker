import { SxProps } from "@mui/material";

export const toggleButtonSize = (isMobile: boolean) => (isMobile ? 40 : 56);

export const controlsStackSX: SxProps = { justifyContent: "space-between" };

export const chipsStackSX: SxProps = { alignItems: "center" };

export const chipsSX: SxProps = { px: 1, py: 1.5 };

export const layoutButtonsStackSX = (isMobile: boolean): SxProps | undefined =>
  isMobile ? { justifyContent: "space-between" } : undefined;

export const sortLabelSX: SxProps = { minWidth: 220 };

export const toggleButtonSX = (isMobile: boolean): SxProps => ({
  size: toggleButtonSize(isMobile),
});

export const gridStackSX: SxProps = {
  flexWrap: "wrap",
  justifyContent: "center",
};
