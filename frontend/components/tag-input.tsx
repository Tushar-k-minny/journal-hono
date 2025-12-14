"use client";

import { X } from "lucide-react";
import { type KeyboardEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { MAX_TAG_LENGTH, MAX_TAGS, MIN_TAG_LENGTH } from "@/lib/constants";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export function TagInput({ value, onChange }: TagInputProps) {
  const [input, setInput] = useState("");

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase();
    if (
      trimmed.length >= MIN_TAG_LENGTH &&
      trimmed.length <= MAX_TAG_LENGTH &&
      value.length < MAX_TAGS &&
      !value.includes(trimmed)
    ) {
      onChange([...value, trimmed]);
      setInput("");
    }
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    } else if (e.key === "," || e.key === " ") {
      e.preventDefault();
      addTag(input);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <span
            className="brutal-border inline-flex items-center gap-1 bg-secondary px-3 py-1 text-secondary-foreground text-sm"
            key={tag}
          >
            {tag}
            <button
              className="hover:text-destructive"
              onClick={() => removeTag(tag)}
              type="button"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag}</span>
            </button>
          </span>
        ))}
      </div>

      {value.length < MAX_TAGS && (
        <Input
          className="brutal-border"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag (press Enter or comma)"
          value={input}
        />
      )}

      <p className="text-muted-foreground text-xs">
        {value.length}/{MAX_TAGS} tags
      </p>
    </div>
  );
}
