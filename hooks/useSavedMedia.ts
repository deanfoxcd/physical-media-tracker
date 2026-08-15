import { useEffect, useState } from "react";
import { getAllSavedMedia } from "@/services/media";
import type { SavedMedia, SavedMediaUpdates } from "@/types/media";

export function useSavedMedia() {
  const [items, setItems] = useState<(SavedMedia & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllSavedMedia()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  // Safe: edits never change media_type, so the merged shape always
  // matches item's original variant even though TS can't prove it here.
  function updateItem(id: string, updates: SavedMediaUpdates) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? ({ ...item, ...updates } as SavedMedia & { id: string })
          : item,
      ),
    );
  }

  return { items, loading, removeItem, updateItem };
}
