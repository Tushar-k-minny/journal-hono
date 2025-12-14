export type Mood =
  | "joyful"
  | "content"
  | "neutral"
  | "anxious"
  | "stressed"
  | "sad"
  | "angry";

export interface EntryAttachment {
  url: string;
  alt?: string;
}

export interface EntryMetadata {
  wordCount: number;
  characterCount: number;
}

export interface Entry {
  id: string;
  userId: string;
  title: string | null;
  content: string;
  mood: Mood;
  tags: string[];
  attachments: EntryAttachment[];
  metadata: EntryMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEntryData {
  title?: string | null;
  content: string;
  mood: Mood;
  tags?: string[];
  attachments?: EntryAttachment[];
}

export interface UpdateEntryData {
  title?: string | null;
  content?: string;
  mood?: Mood;
  tags?: string[];
  attachments?: EntryAttachment[];
}

export interface EntryFilters {
  q?: string;
  from?: string;
  to?: string;
  mood?: Mood;
  tags?: string[];
  limit?: number;
  cursor?: string;
  sort?: "asc" | "desc";
}

export const MOOD_CONFIG: Record<
  Mood,
  { emoji: string; label: string; color: string }
> = {
  joyful: { emoji: "😊", label: "Joyful", color: "bg-chart-1" },
  content: { emoji: "😌", label: "Content", color: "bg-chart-2" },
  neutral: { emoji: "😐", label: "Neutral", color: "bg-muted" },
  anxious: { emoji: "😰", label: "Anxious", color: "bg-chart-4" },
  stressed: { emoji: "😫", label: "Stressed", color: "bg-chart-5" },
  sad: { emoji: "😢", label: "Sad", color: "bg-chart-3" },
  angry: { emoji: "😠", label: "Angry", color: "bg-destructive" },
};
