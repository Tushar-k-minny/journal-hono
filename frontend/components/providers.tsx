"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useThemeStore } from "@/store/theme-store";

function ThemeInitializer() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: (failureCount, error) => {
              if ((error as { status?: number }).status === 401) return false;
              if ((error as { status?: number }).status === 404) return false;
              return failureCount < 3;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeInitializer />
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}
