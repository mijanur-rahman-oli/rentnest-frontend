"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, X, ImageOff } from "lucide-react";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
  error?: string;
}

/**
 * A lightweight "upload" UI built around image URLs rather than binary
 * file storage (the backend stores `images: string[]` of URLs, with no
 * file-storage endpoint). Landlords paste a URL, see an immediate
 * thumbnail preview, and can remove any image before submitting —
 * giving the add/preview/remove experience the spec asks for without
 * requiring a separate file-storage service.
 */
export function ImageUrlUploader({ value, onChange, error }: Props) {
  const [draft, setDraft] = useState("");
  const [draftError, setDraftError] = useState<string | null>(null);

  const addImage = () => {
    const url = draft.trim();
    if (!url) return;

    try {
      new URL(url);
    } catch {
      setDraftError("Enter a valid URL (must start with http:// or https://)");
      return;
    }

    if (value.includes(url)) {
      setDraftError("That image is already added");
      return;
    }

    onChange([...value, url]);
    setDraft("");
    setDraftError(null);
  };

  const removeImage = (url: string) => {
    onChange(value.filter((u) => u !== url));
  };

  return (
    <div>
      <div className="flex gap-2">
        <Input
          placeholder="https://images.example.com/photo.jpg"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setDraftError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addImage();
            }
          }}
        />
        <Button type="button" variant="secondary" onClick={addImage}>
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>
      {(draftError || error) && <p className="mt-1 text-xs text-red-600">{draftError || error}</p>}

      {value.length > 0 ? (
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {value.map((url) => (
            <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              <Image
                src={url}
                alt="Property"
                fill
                sizes="120px"
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
          <ImageOff className="h-4 w-4" />
          No images added yet — paste a URL above and click Add.
        </div>
      )}
    </div>
  );
}
