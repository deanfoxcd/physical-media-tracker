import { useEffect, useState } from "react";
import { getAllSavedMedia } from "@/services/media";
import type { SavedMedia } from "@/types/media";

export function useSavedMedia() {
  const [items, setItems] = useState<(SavedMedia & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllSavedMedia()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  return { items, loading };
}
