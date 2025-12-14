import type { Metadata } from "next";
import { ArchiveView } from "@/components/archive-view";

export const metadata: Metadata = {
  title: "Archive - Daily Journal",
  description: "Browse all your journal entries",
};

export default function ArchivePage() {
  return <ArchiveView />;
}
