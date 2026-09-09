"use client";
import { createTheme, type PaletteMode, type ThemeOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    tray: { main: string; border: string };
  }
  interface PaletteOptions {
    tray?: { main: string; border: string };
  }
}

const shared: ThemeOptions = {
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: "none",
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: 3,
        },
      },
    },
  },
};

const lightTheme = createTheme({
  ...shared,
  palette: {
    mode: "light",
    primary: {
      main: "#1F2A44",
      light: "#3C4A6B",
      dark: "#121A2E",
      contrastText: "#FAF6EF",
    },
    secondary: {
      main: "#C99A3D",
      light: "#E0BD72",
      dark: "#9C7726",
      contrastText: "#1F2A44",
    },
    background: {
      default: "#FAF6EF",
      paper: "#FDFBF6",
    },
    text: {
      primary: "#22201B",
      secondary: "#6B645A",
    },
    divider: "#EDE6D8",
    tray: {
      main: "#DDE1E8",
      border: "#C7CDD9",
    },
  },
});

const darkTheme = createTheme({
  ...shared,
  palette: {
    mode: "dark",
    primary: {
      main: "#D9AE55",
      light: "#E7C57E",
      dark: "#9C7726",
      contrastText: "#0F1B1D",
    },
    secondary: {
      main: "#7FB3B0",
      light: "#A2C9C7",
      dark: "#5C8A87",
      contrastText: "#0F1B1D",
    },
    background: {
      default: "#0F1B1D",
      paper: "#16262A",
    },
    text: {
      primary: "#E4EFEE",
      secondary: "#94A8A7",
    },
    divider: "#28393C",
    tray: {
      main: "#1B2E30",
      border: "#2C4548",
    },
  },
});

export function getTheme(mode: PaletteMode) {
  return mode === "dark" ? darkTheme : lightTheme;
}
