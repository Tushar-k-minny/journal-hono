import type { Metadata } from "next";
import { EntryEditor } from "@/components/entry-editor";

export const metadata: Metadata = {
  title: "Edit Entry - Daily Journal",
  description: "Edit your journal entry",
};

export default async function EditEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EntryEditor entryId={id} />;
}
