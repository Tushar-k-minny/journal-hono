"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  ArrowLeft,
  Clock,
  Loader2,
  Maximize2,
  Minimize2,
  Save,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateEntry,
  useDeleteEntry,
  useEntry,
  useUpdateEntry,
} from "@/hooks/use-entries";
import { AUTO_SAVE_INTERVAL, MAX_TITLE_LENGTH, ROUTES } from "@/lib/constants";
import type { Mood } from "@/types/entry";
import { MoodSelector } from "./mood-selector";
import { TagInput } from "./tag-input";

const entrySchema = z.object({
  title: z
    .string()
    .max(
      MAX_TITLE_LENGTH,
      `Title must be ${MAX_TITLE_LENGTH} characters or less`
    )
    .optional(),
  content: z.string().min(1, "Content is required"),
  mood: z.enum([
    "joyful",
    "content",
    "neutral",
    "anxious",
    "stressed",
    "sad",
    "angry",
  ]),
  tags: z.array(z.string()).max(12, "Maximum 12 tags allowed"),
});

type EntryFormData = z.infer<typeof entrySchema>;

interface EntryEditorProps {
  entryId?: string;
}

export function EntryEditor({ entryId }: EntryEditorProps) {
  const router = useRouter();
  const isEditing = !!entryId;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const { data: entry, isLoading: isLoadingEntry } = useEntry(entryId || "");
  const createMutation = useCreateEntry();
  const updateMutation = useUpdateEntry();
  const deleteMutation = useDeleteEntry();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EntryFormData>({
    // biome-ignore lint/suspicious/noExplicitAny: zodResolver type mismatch
    resolver: zodResolver(entrySchema as any),
    defaultValues: {
      title: "",
      content: "",
      mood: "neutral",
      tags: [],
    },
  });

  const content = watch("content");
  const mood = watch("mood");
  const tags = watch("tags");

  // Calculate word count
  const wordCount = content
    ? content.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const charCount = content?.length || 0;

  // Load entry data when editing
  useEffect(() => {
    if (entry && isEditing) {
      reset({
        title: entry.title || "",
        content: entry.content,
        mood: entry.mood,
        tags: entry.tags,
      });
    }
  }, [entry, isEditing, reset]);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!(isDirty && isEditing && entryId)) return;

    const formData = watch();
    if (!formData.content) return;

    try {
      await updateMutation.mutateAsync({
        id: entryId,
        data: {
          title: formData.title || null,
          content: formData.content,
          mood: formData.mood,
          tags: formData.tags,
        },
      });
      setLastSaved(new Date());
      setIsDirty(false);
    } catch {
      // Silent fail for auto-save
    }
  }, [isDirty, isEditing, entryId, watch, updateMutation]);

  useEffect(() => {
    if (!isEditing) {
      return;
    }
    const interval = setInterval(autoSave, AUTO_SAVE_INTERVAL);
    return () => clearInterval(interval);
  }, [autoSave, isEditing]);

  // Track dirty state
  useEffect(() => {
    const subscription = watch(() => setIsDirty(true));
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data: EntryFormData) => {
    try {
      if (isEditing && entryId) {
        await updateMutation.mutateAsync({
          id: entryId,
          data: {
            title: data.title || null,
            content: data.content,
            mood: data.mood,
            tags: data.tags,
          },
        });
        setLastSaved(new Date());
        setIsDirty(false);
      } else {
        const newEntry = await createMutation.mutateAsync({
          title: data.title || null,
          content: data.content,
          mood: data.mood,
          tags: data.tags,
        });
        router.push(ROUTES.EDIT_ENTRY(newEntry.id));
      }
    } catch {
      // Error handled by mutation
    }
  };

  const handleDelete = async () => {
    if (!entryId) return;
    if (
      !confirm(
        "Are you sure you want to delete this entry? This cannot be undone."
      )
    )
      return;

    try {
      await deleteMutation.mutateAsync(entryId);
      router.push(ROUTES.DASHBOARD);
    } catch {
      // Error handled by mutation
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isEditing && isLoadingEntry) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div
      className={`px-4 py-8 sm:px-6 lg:px-8 ${isFullscreen ? "fixed inset-0 z-50 overflow-auto bg-background" : ""}`}
    >
      <div className={`mx-auto ${isFullscreen ? "max-w-4xl" : "max-w-3xl"}`}>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            className="brutal-border brutal-shadow-sm brutal-hover"
            onClick={() => router.back()}
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            {lastSaved && (
              <span className="flex items-center gap-1 text-muted-foreground text-xs">
                <Clock className="h-3 w-3" />
                Saved {format(lastSaved, "h:mm a")}
              </span>
            )}

            <Button
              className="brutal-border brutal-shadow-sm brutal-hover"
              onClick={() => setIsFullscreen(!isFullscreen)}
              size="icon"
              variant="outline"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle fullscreen</span>
            </Button>

            {isEditing && (
              <Button
                className="brutal-border brutal-shadow-sm brutal-hover bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground"
                disabled={deleteMutation.isPending}
                onClick={handleDelete}
                size="icon"
                variant="outline"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                <span className="sr-only">Delete</span>
              </Button>
            )}
          </div>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Title */}
          <div className="space-y-2">
            <Label className="font-medium" htmlFor="title">
              Title{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Input
              className="brutal-border font-medium text-lg"
              id="title"
              placeholder="Give your entry a title..."
              {...register("title")}
            />
            {errors.title && (
              <p className="text-destructive text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Mood */}
          <div className="space-y-2">
            <Label className="font-medium">How are you feeling?</Label>
            <MoodSelector
              onChange={(m) => setValue("mood", m as Mood)}
              value={mood}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="font-medium" htmlFor="content">
                What&apos;s on your mind?
              </Label>
              <span className="text-muted-foreground text-xs">
                {wordCount} words · {charCount} characters
              </span>
            </div>
            <Textarea
              className="brutal-border min-h-[300px] resize-y"
              id="content"
              placeholder="Start writing..."
              {...register("content")}
            />
            {errors.content && (
              <p className="text-destructive text-sm">
                {errors.content.message}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="font-medium">
              Tags{" "}
              <span className="font-normal text-muted-foreground">
                (up to 12)
              </span>
            </Label>
            <TagInput onChange={(t) => setValue("tags", t)} value={tags} />
            {errors.tags && (
              <p className="text-destructive text-sm">{errors.tags.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              className="brutal-border brutal-shadow-sm brutal-hover"
              onClick={() => router.back()}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              className="brutal-border brutal-shadow brutal-hover bg-primary text-primary-foreground"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? "Save Changes" : "Create Entry"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
