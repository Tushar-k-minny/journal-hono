import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",
      toggleTheme: () => {
        const newTheme = get().theme === "light" ? "dark" : "light";
        set({ theme: newTheme });
        updateDocumentTheme(newTheme);
      },
      setTheme: (theme) => {
        set({ theme });
        updateDocumentTheme(theme);
      },
    }),
    {
      name: "journal-theme",
      onRehydrateStorage: () => (state) => {
        if (state) {
          updateDocumentTheme(state.theme);
        }
      },
    }
  )
);

function updateDocumentTheme(theme: Theme) {
  if (typeof document !== "undefined") {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }
}
