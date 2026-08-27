import { useState } from "react";
import { SavedMedia } from "@/types/media";
import {
  Dialog,
  DialogContent,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import localization from "../../../locales/en";
import { ActionButton } from "../../blocks/ActionButton";
import {
  MediaDetailsForm,
  type MediaDetailsFormValues,
} from "../../blocks/MediaDetailsForm/MediaDetailsForm";
import { deleteSavedMedia, updateSavedMedia } from "@/services/media";
import {
  boldTextSX,
  buttonStackSX,
  dialogSX,
  editButtonSX,
  headerStackSX,
} from "./styles";

type SavedMediaDetailsProps = {
  savedItem: SavedMedia & { id: string };
  open: boolean;
  onClose: () => void;
  onUpdated?: (id: string, updates: Partial<SavedMedia>) => void;
  onRemoved?: (id: string) => void;
};

export const SavedMediaDetails = ({
  savedItem,
  open,
  onClose,
  onUpdated,
  onRemoved,
}: SavedMediaDetailsProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [editing, setEditing] = useState(false);
  const [removing, setRemoving] = useState(false);

  async function handleRemove() {
    setRemoving(true);
    try {
      await deleteSavedMedia(savedItem.id);
      onRemoved?.(savedItem.id);
      onClose();
    } finally {
      setRemoving(false);
    }
  }

  async function handleSubmit(values: MediaDetailsFormValues) {
    const updates = {
      ...values,
      pricePaid: values.pricePaid === "" ? 0 : values.pricePaid,
    };
    await updateSavedMedia(
      savedItem.id,
      updates,
      localization.savedMediaDetails.savedToCollection,
    );
    onUpdated?.(savedItem.id, updates);
    setEditing(false);
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth sx={dialogSX}>
      <DialogContent>
        {editing ? (
          <MediaDetailsForm
            defaultValues={{
              format: savedItem.format,
              condition: savedItem.condition,
              acquiredFrom: savedItem.acquiredFrom,
              acquiredDate: savedItem.acquiredDate,
              pricePaid: savedItem.pricePaid ?? "",
              notes: savedItem.notes,
              review: savedItem.review,
              rating: savedItem.rating,
            }}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(false)}
            title={
              savedItem.media_type === "movie"
                ? savedItem.title
                : savedItem.name
            }
          />
        ) : (
          <Stack spacing={3}>
            <Stack direction="row" sx={headerStackSX}>
              <Typography variant="h6">
                {savedItem.media_type === "movie"
                  ? savedItem.title
                  : savedItem.name}
              </Typography>
              <ActionButton
                minor
                onClick={onClose}
                size={isMobile ? "small" : "medium"}
              >
                X
              </ActionButton>
            </Stack>

            <Stack spacing={1}>
              <Stack direction="row" spacing={1}>
                <Typography sx={boldTextSX}>
                  {localization.savedMediaDetails.format}
                </Typography>
                <Typography>{savedItem.format}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography sx={boldTextSX}>
                  {localization.savedMediaDetails.condition}
                </Typography>
                <Typography>{savedItem.condition}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography sx={boldTextSX}>
                  {localization.savedMediaDetails.acquiredFrom}
                </Typography>
                <Typography>{savedItem.acquiredFrom}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography sx={boldTextSX}>
                  {localization.savedMediaDetails.acquiredDate}
                </Typography>
                <Typography>{savedItem.acquiredDate}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography sx={boldTextSX}>
                  {localization.savedMediaDetails.pricePaid}
                </Typography>
                <Typography>${savedItem.pricePaid}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography sx={boldTextSX}>
                  {localization.savedMediaDetails.notes}
                </Typography>
                <Typography>{savedItem.notes}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography sx={boldTextSX}>
                  {localization.savedMediaDetails.review}
                </Typography>
                <Typography>{savedItem.review}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography sx={boldTextSX}>
                  {localization.savedMediaDetails.rating}
                </Typography>
                <Typography>{savedItem.rating} / 10</Typography>
              </Stack>
            </Stack>
            <Stack direction="row" spacing={1} sx={buttonStackSX}>
              <ActionButton
                minor
                onClick={handleRemove}
                disabled={removing}
                size={isMobile ? "small" : "medium"}
              >
                {removing ? "Removing..." : "Remove from Collection"}
              </ActionButton>
              <ActionButton
                minor
                onClick={() => setEditing(true)}
                sx={editButtonSX}
                size={isMobile ? "small" : "medium"}
              >
                Edit
              </ActionButton>
            </Stack>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};
