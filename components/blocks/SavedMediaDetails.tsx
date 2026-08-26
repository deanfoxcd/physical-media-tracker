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
import localization from "../../locales/en";
import { ActionButton } from "./ActionButton";
import {
  MediaDetailsForm,
  type MediaDetailsFormValues,
} from "./MediaDetailsForm";
import { updateSavedMedia } from "@/services/media";

type SavedMediaDetailsProps = {
  savedItem: SavedMedia & { id: string };
  open: boolean;
  onClose: () => void;
  onUpdated?: (id: string, updates: Partial<SavedMedia>) => void;
};

export const SavedMediaDetails = ({
  savedItem,
  open,
  onClose,
  onUpdated,
}: SavedMediaDetailsProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [editing, setEditing] = useState(false);

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
    <Dialog open={open} onClose={onClose} fullWidth sx={{ maxwidth: "md" }}>
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
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
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
                <Typography sx={{ fontWeight: "bold" }}>
                  {localization.savedMediaDetails.format}
                </Typography>
                <Typography>{savedItem.format}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography sx={{ fontWeight: "bold" }}>
                  {localization.savedMediaDetails.condition}
                </Typography>
                <Typography>{savedItem.condition}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography sx={{ fontWeight: "bold" }}>
                  {localization.savedMediaDetails.acquiredFrom}
                </Typography>
                <Typography>{savedItem.acquiredFrom}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography sx={{ fontWeight: "bold" }}>
                  {localization.savedMediaDetails.acquiredDate}
                </Typography>
                <Typography>{savedItem.acquiredDate}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography sx={{ fontWeight: "bold" }}>
                  {localization.savedMediaDetails.pricePaid}
                </Typography>
                <Typography>${savedItem.pricePaid}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography sx={{ fontWeight: "bold" }}>
                  {localization.savedMediaDetails.notes}
                </Typography>
                <Typography>{savedItem.notes}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography sx={{ fontWeight: "bold" }}>
                  {localization.savedMediaDetails.review}
                </Typography>
                <Typography>{savedItem.review}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography sx={{ fontWeight: "bold" }}>
                  {localization.savedMediaDetails.rating}
                </Typography>
                <Typography>{savedItem.rating} / 10</Typography>
              </Stack>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignSelf: "end" }}>
              <ActionButton
                minor
                onClick={() => setEditing(true)}
                sx={{ textBox: "trim-both cap alphabetic" }}
                size={isMobile ? "small" : "medium"}
              >
                Edit
              </ActionButton>
              <ActionButton minor size={isMobile ? "small" : "medium"}>
                Remove from Collection
              </ActionButton>
            </Stack>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};
