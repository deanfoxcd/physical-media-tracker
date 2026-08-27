"use client";
import { Dialog, DialogContent } from "@mui/material";
import { SavedMedia, SavedMediaUpdates } from "@/types/media";
import { SavedMediaDetails } from "./SavedMediaDetails/SavedMediaDetails";
import {
  MediaDetailsForm,
  MediaDetailsFormValues,
} from "../blocks/MediaDetailsForm/MediaDetailsForm";
import { DEFAULT_FORM_VALUES } from "@/constants/addToCollectionFormValues";
import { deleteSavedMedia } from "@/services/media";

interface SavedItemDialogsProps {
  savedItem: SavedMedia & { id: string };
  detailsOpen: boolean;
  onDetailsClose: () => void;
  moveToCollectionOpen: boolean;
  onMoveToCollectionClose: () => void;
  onMoveToCollectionSubmit: (values: MediaDetailsFormValues) => void;
  onUpdated?: (id: string, updates: SavedMediaUpdates) => void;
  onRemoved?: (id: string) => void;
}

export const SavedItemDialogs = ({
  savedItem,
  detailsOpen,
  onDetailsClose,
  moveToCollectionOpen,
  onMoveToCollectionClose,
  onMoveToCollectionSubmit,
  onUpdated,
  onRemoved,
}: SavedItemDialogsProps) => {
  async function handleRemoveFromWishlist() {
    await deleteSavedMedia(savedItem.id);
    onRemoved?.(savedItem.id);
    onMoveToCollectionClose();
  }

  return (
    <>
      <SavedMediaDetails
        savedItem={savedItem}
        open={detailsOpen}
        onClose={onDetailsClose}
        onUpdated={onUpdated}
        onRemoved={onRemoved}
      />
      <Dialog
        open={moveToCollectionOpen}
        onClose={onMoveToCollectionClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
          <MediaDetailsForm
            defaultValues={{
              ...DEFAULT_FORM_VALUES,
              format: savedItem.format,
              notes: savedItem.notes ?? "",
            }}
            onSubmit={onMoveToCollectionSubmit}
            onCancel={onMoveToCollectionClose}
            title={
              savedItem.media_type === "movie"
                ? savedItem.title
                : savedItem.name
            }
            onDelete={handleRemoveFromWishlist}
            deleteLabel="Remove from Wishlist"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
