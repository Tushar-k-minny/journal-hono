import type { Metadata } from "next";
import { AnalyticsView } from "@/components/analytics-view";

export const metadata: Metadata = {
  title: "Analytics - Daily Journal",
  description: "View insights and trends from your journal entries",
};

export default function AnalyticsPage() {
  return <AnalyticsView />;
}
