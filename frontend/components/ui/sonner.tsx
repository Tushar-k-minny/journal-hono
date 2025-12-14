"use client";

import { Toaster as Sonner } from "sonner";
import { useThemeStore } from "@/store/theme-store";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const theme = useThemeStore((state) => state.theme);

  return (
    <Sonner
      className="toaster group"
      theme={theme as ToasterProps["theme"]}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-2 group-[.toaster]:border-foreground group-[.toaster]:shadow-[4px_4px_0_0_var(--foreground)] group-[.toaster]:font-sans",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
