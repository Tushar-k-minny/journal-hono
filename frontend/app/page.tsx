import {
  ArrowRight,
  BarChart3,
  Calendar,
  PenLine,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

const features = [
  {
    icon: PenLine,
    title: "Rich Writing",
    description:
      "Express yourself with a beautiful, distraction-free editor. Add tags, images, and format your thoughts.",
    color: "bg-primary",
  },
  {
    icon: Sparkles,
    title: "Mood Tracking",
    description:
      "Track how you feel each day. Visualize patterns and understand your emotional journey.",
    color: "bg-secondary",
  },
  {
    icon: Calendar,
    title: "Calendar View",
    description:
      "See your journaling history at a glance. Never miss a day and build your writing habit.",
    color: "bg-accent",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "Gain insights into your writing patterns, word counts, and mood trends over time.",
    color: "bg-chart-4",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-balance font-bold text-4xl tracking-tight sm:text-5xl lg:text-6xl">
                  Your thoughts,
                  <br />
                  <span className="brutal-border brutal-shadow mt-2 inline-block bg-primary px-2">
                    beautifully captured
                  </span>
                </h1>
                <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-muted-foreground sm:text-xl lg:mx-0">
                  A modern journal app that helps you reflect, track your moods,
                  and understand yourself better. Write freely, grow
                  continuously.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                  <Link href={ROUTES.REGISTER}>
                    <Button
                      className="brutal-border brutal-shadow brutal-hover w-full bg-primary px-8 text-lg text-primary-foreground sm:w-auto"
                      size="lg"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href={ROUTES.LOGIN}>
                    <Button
                      className="brutal-border brutal-shadow-sm brutal-hover w-full bg-transparent px-8 text-lg sm:w-auto"
                      size="lg"
                      variant="outline"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Hero Visual */}
              <div className="w-full max-w-lg flex-1">
                <div className="brutal-border brutal-shadow-lg bg-card p-6 sm:p-8">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="brutal-border h-3 w-3 rounded-full bg-destructive" />
                    <div className="brutal-border h-3 w-3 rounded-full bg-primary" />
                    <div className="brutal-border h-3 w-3 rounded-full bg-secondary" />
                  </div>
                  <div className="space-y-4">
                    <div className="brutal-border h-4 w-3/4 bg-muted" />
                    <div className="brutal-border h-4 w-full bg-muted" />
                    <div className="brutal-border h-4 w-5/6 bg-muted" />
                    <div className="brutal-border h-4 w-2/3 bg-muted" />
                  </div>
                  <div className="mt-6 flex gap-2">
                    <span className="brutal-border bg-primary px-3 py-1 font-medium text-xs">
                      grateful
                    </span>
                    <span className="brutal-border bg-secondary px-3 py-1 font-medium text-xs">
                      reflection
                    </span>
                    <span className="brutal-border bg-accent px-3 py-1 font-medium text-xs">
                      growth
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="brutal-border border-x-0 bg-muted py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center sm:mb-16">
              <h2 className="font-bold text-3xl sm:text-4xl">
                Everything you need to
                <span className="brutal-border brutal-shadow-sm ml-2 bg-secondary px-2">
                  journal better
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Powerful features designed to help you build a consistent
                journaling habit and gain meaningful insights from your writing.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  className="brutal-border brutal-shadow brutal-hover flex flex-col bg-card p-6"
                  key={feature.title}
                >
                  <div
                    className={`h-12 w-12 ${feature.color} brutal-border brutal-shadow-sm mb-4 flex items-center justify-center`}
                  >
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-bold text-xl">{feature.title}</h3>
                  <p className="flex-1 text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="brutal-border brutal-shadow-lg bg-primary p-8 sm:p-12">
              <h2 className="mb-4 font-bold text-3xl text-primary-foreground sm:text-4xl">
                Start your journaling journey today
              </h2>
              <p className="mb-8 text-lg text-primary-foreground/80">
                Join thousands of people who use Daily Journal to reflect, grow,
                and understand themselves better.
              </p>
              <Link href={ROUTES.REGISTER}>
                <Button
                  className="brutal-border brutal-shadow brutal-hover bg-card px-8 text-foreground text-lg"
                  size="lg"
                  variant="outline"
                >
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
