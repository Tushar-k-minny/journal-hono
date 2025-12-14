import type { Metadata } from "next";
import { EntryEditor } from "@/components/entry-editor";

export const metadata: Metadata = {
  title: "New Entry - Daily Journal",
  description: "Create a new journal entry",
};

export default function NewEntryPage() {
  return <EntryEditor />;
}
