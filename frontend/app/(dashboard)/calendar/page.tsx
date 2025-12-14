import type { Metadata } from "next";
import { CalendarView } from "@/components/calendar-view";

export const metadata: Metadata = {
  title: "Calendar - Daily Journal",
  description: "View your journal entries by date",
};

export default function CalendarPage() {
  return <CalendarView />;
}
