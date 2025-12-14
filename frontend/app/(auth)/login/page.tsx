import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { LoginForm } from "@/components/login-form";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sign In - Daily Journal",
  description: "Sign in to your Daily Journal account",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="font-bold text-3xl sm:text-4xl">
              Welcome{" "}
              <span className="brutal-border brutal-shadow-sm bg-primary px-2">
                back
              </span>
            </h1>
            <p className="mt-3 text-muted-foreground">
              Sign in to continue your journaling journey
            </p>
          </div>

          <div className="brutal-border brutal-shadow-lg bg-card p-6 sm:p-8">
            <LoginForm />

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                {"Don't have an account?"}{" "}
              </span>
              <Link
                className="font-medium underline underline-offset-4 hover:text-primary"
                href={ROUTES.REGISTER}
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
