import { useEffect, useState } from "react";
import { getAllSavedMedia, getSavedMediaByStatus } from "@/services/media";
import type { SavedMedia, SavedMediaUpdates } from "@/types/media";
import { useAuth } from "@/contexts/AuthContext";

export function useSavedMedia(status?: "owned" | "wishlist") {
  const { user } = useAuth();
  const [items, setItems] = useState<(SavedMedia & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems([]);
      setLoading(false);
      return;
    }
    const fetchItems = status
      ? getSavedMediaByStatus(status, user.uid)
      : getAllSavedMedia(user.uid);
    fetchItems
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status, user]);

  function addItem(item: SavedMedia & { id: string }) {
    setItems((prev) => {
      if (status && item.status !== status) return prev;
      return [item, ...prev];
    });
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  // Safe: edits never change media_type, so the merged shape always
  // matches item's original variant even though TS can't prove it here.
  function updateItem(id: string, updates: SavedMediaUpdates) {
    setItems((prev) => {
      if (status && "status" in updates && updates.status !== status) {
        return prev.filter((item) => item.id !== id);
      }
      return prev.map((item) =>
        item.id === id
          ? ({ ...item, ...updates } as SavedMedia & { id: string })
          : item,
      );
    });
  }

  return { items, loading, addItem, removeItem, updateItem };
}
