"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { ThemeProvider, type PaletteMode } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getTheme } from "@/lib/theme";

const THEME_MODE_KEY = "themeMode";

interface ThemeModeContextValue {
  mode: PaletteMode;
  toggleMode: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>("light");

  useEffect(() => {
    const stored = localStorage.getItem(THEME_MODE_KEY);
    if (stored === "light" || stored === "dark") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode(stored);
    }
  }, []);

  function toggleMode() {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem(THEME_MODE_KEY, next);
      return next;
    });
  }

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={getTheme(mode)}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error("useThemeMode must be used within a ThemeModeProvider");
  }
  return ctx;
}
