"use client";
import { Dialog, DialogContent } from "@mui/material";
import { SavedMedia, SavedMediaUpdates } from "@/types/media";
import { SavedMediaDetails } from "./SavedMediaDetails";
import { MediaDetailsForm, MediaDetailsFormValues } from "./MediaDetailsForm";
import { DEFAULT_FORM_VALUES } from "@/constants/addToCollectionFormValues";

interface SavedItemDialogsProps {
  savedItem: SavedMedia & { id: string };
  detailsOpen: boolean;
  onDetailsClose: () => void;
  moveToCollectionOpen: boolean;
  onMoveToCollectionClose: () => void;
  onMoveToCollectionSubmit: (values: MediaDetailsFormValues) => void;
  onUpdated?: (id: string, updates: SavedMediaUpdates) => void;
}

export const SavedItemDialogs = ({
  savedItem,
  detailsOpen,
  onDetailsClose,
  moveToCollectionOpen,
  onMoveToCollectionClose,
  onMoveToCollectionSubmit,
  onUpdated,
}: SavedItemDialogsProps) => (
  <>
    <SavedMediaDetails
      savedItem={savedItem}
      open={detailsOpen}
      onClose={onDetailsClose}
      onUpdated={onUpdated}
    />
    <Dialog
      open={moveToCollectionOpen}
      onClose={onMoveToCollectionClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogContent>
        <MediaDetailsForm
          defaultValues={{ ...DEFAULT_FORM_VALUES, format: savedItem.format }}
          onSubmit={onMoveToCollectionSubmit}
          onCancel={onMoveToCollectionClose}
        />
      </DialogContent>
    </Dialog>
  </>
);
