import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { RegisterForm } from "@/components/register-form";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Create Account - Daily Journal",
  description: "Create your Daily Journal account and start journaling",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="font-bold text-3xl sm:text-4xl">
              Create your{" "}
              <span className="brutal-border brutal-shadow-sm bg-secondary px-2">
                account
              </span>
            </h1>
            <p className="mt-3 text-muted-foreground">
              Start your journaling journey today
            </p>
          </div>

          <div className="brutal-border brutal-shadow-lg bg-card p-6 sm:p-8">
            <RegisterForm />

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>
              <Link
                className="font-medium underline underline-offset-4 hover:text-primary"
                href={ROUTES.LOGIN}
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
