import type { Metadata } from "next";
import { DashboardContent } from "@/components/dashboard-content";

export const metadata: Metadata = {
  title: "Dashboard - Daily Journal",
  description: "Your journaling dashboard",
};

export default function DashboardPage() {
  return <DashboardContent />;
}
