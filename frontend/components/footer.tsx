import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="brutal-border mt-auto border-x-0 border-b-0 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm">
            <Link
              className="text-muted-foreground transition-colors hover:text-foreground"
              href="#"
            >
              Privacy
            </Link>
            <Link
              className="text-muted-foreground transition-colors hover:text-foreground"
              href="#"
            >
              Terms
            </Link>
            <Link
              className="text-muted-foreground transition-colors hover:text-foreground"
              href="#"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
