"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/theme-store";

export function useTheme() {
  const { theme, toggleTheme, setTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return { theme, toggleTheme, setTheme };
}
