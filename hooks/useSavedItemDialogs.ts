"use client";
import { useState } from "react";
import { SavedMedia, SavedMediaUpdates } from "@/types/media";
import { updateSavedMedia } from "@/services/media";
import { MediaDetailsFormValues } from "@/components/blocks/MediaDetailsForm/MediaDetailsForm";

export function useSavedItemDialogs(
  savedItem: SavedMedia & { id: string },
  onUpdated?: (id: string, updates: SavedMediaUpdates) => void,
) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [moveToCollectionOpen, setMoveToCollectionOpen] = useState(false);

  const handleMoveToCollection = async (values: MediaDetailsFormValues) => {
    const updates: SavedMediaUpdates = {
      ...values,
      status: "owned",
      pricePaid: values.pricePaid === "" ? 0 : values.pricePaid,
    };
    await updateSavedMedia(savedItem.id, updates, "Moved to Collection");
    onUpdated?.(savedItem.id, updates);
    setMoveToCollectionOpen(false);
  };

  const openPrimary = () => {
    if (savedItem.status === "owned") {
      setDetailsOpen(true);
    } else {
      setMoveToCollectionOpen(true);
    }
  };

  return {
    detailsOpen,
    setDetailsOpen,
    moveToCollectionOpen,
    setMoveToCollectionOpen,
    handleMoveToCollection,
    openPrimary,
  };
}
