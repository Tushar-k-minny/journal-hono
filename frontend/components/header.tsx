"use client";

import { LogOut, Menu, Moon, PenLine, Sun, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { APP_NAME, ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: ROUTES.DASHBOARD, label: "Dashboard" },
  { href: ROUTES.CALENDAR, label: "Calendar" },
  { href: ROUTES.ARCHIVE, label: "Archive" },
  { href: ROUTES.ANALYTICS, label: "Analytics" },
];

export function Header() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="brutal-border sticky top-0 z-50 border-x-0 border-t-0 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            className="flex items-center gap-2 font-bold text-xl"
            href={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME}
          >
            <div className="brutal-border brutal-shadow-sm flex h-8 w-8 items-center justify-center bg-primary">
              <PenLine className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="hidden sm:block">{APP_NAME}</span>
          </Link>

          {/* Desktop Navigation */}
          {!!isAuthenticated && (
            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <Link
                  className={cn(
                    "brutal-hover px-4 py-2 font-medium text-sm transition-colors",
                    pathname === link.href
                      ? "brutal-border brutal-shadow-sm bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <Button
              className="brutal-border brutal-shadow-sm brutal-hover bg-transparent"
              onClick={toggleTheme}
              size="icon"
              variant="outline"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {isAuthenticated ? (
              <>
                <Link className="hidden sm:block" href={ROUTES.NEW_ENTRY}>
                  <Button className="brutal-border brutal-shadow brutal-hover bg-primary text-primary-foreground">
                    <PenLine className="mr-2 h-4 w-4" />
                    New Entry
                  </Button>
                </Link>

                <Link className="hidden md:block" href={ROUTES.PROFILE}>
                  <Button
                    className="brutal-border brutal-shadow-sm brutal-hover bg-transparent"
                    size="icon"
                    variant="outline"
                  >
                    <User className="h-4 w-4" />
                    <span className="sr-only">Profile</span>
                  </Button>
                </Link>

                <Button
                  className="brutal-border brutal-shadow-sm brutal-hover hidden md:flex"
                  onClick={() => logout()}
                  size="icon"
                  variant="outline"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Logout</span>
                </Button>

                {/* Mobile menu button */}
                <Button
                  className="brutal-border brutal-shadow-sm bg-transparent md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  size="icon"
                  variant="outline"
                >
                  {mobileMenuOpen ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Menu className="h-4 w-4" />
                  )}
                  <span className="sr-only">Menu</span>
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href={ROUTES.LOGIN}>
                  <Button
                    className="brutal-border brutal-shadow-sm brutal-hover bg-transparent"
                    variant="outline"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link className="hidden sm:block" href={ROUTES.REGISTER}>
                  <Button className="brutal-border brutal-shadow brutal-hover bg-primary text-primary-foreground">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {!!isAuthenticated && mobileMenuOpen && (
        <div className="brutal-border border-x-0 bg-background md:hidden">
          <nav className="flex flex-col gap-2 p-4">
            {navLinks.map((link) => (
              <Link
                className={cn(
                  "brutal-border px-4 py-3 font-medium text-sm",
                  pathname === link.href
                    ? "brutal-shadow-sm bg-primary text-primary-foreground"
                    : "bg-card"
                )}
                href={link.href}
                key={link.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              className="brutal-border brutal-shadow-sm flex items-center gap-2 bg-secondary px-4 py-3 font-medium text-secondary-foreground text-sm"
              href={ROUTES.NEW_ENTRY}
              onClick={() => setMobileMenuOpen(false)}
            >
              <PenLine className="h-4 w-4" />
              New Entry
            </Link>
            <Link
              className="brutal-border flex items-center gap-2 bg-card px-4 py-3 font-medium text-sm"
              href={ROUTES.PROFILE}
              onClick={() => setMobileMenuOpen(false)}
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
            <button
              className="brutal-border flex items-center gap-2 bg-destructive px-4 py-3 text-left font-medium text-destructive-foreground text-sm"
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              type="button"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
