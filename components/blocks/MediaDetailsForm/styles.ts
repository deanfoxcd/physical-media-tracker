import { SxProps } from "@mui/material";

export const priceSX: SxProps = {
  "& input[type=number]": { MozAppearance: "textfield" },
  "& input[type=number]::-webkit-outer-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
  "& input[type=number]::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
};

export const buttonStackSX: SxProps = {
  justifyContent: "end",
};

export const headerStackSX: SxProps = {
  justifyContent: "space-between",
  alignItems: "center",
};
