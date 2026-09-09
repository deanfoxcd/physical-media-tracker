"use client";
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
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
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid #EDE6D8",
        },
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
});
