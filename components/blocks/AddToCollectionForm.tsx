import { Dialog, DialogContent } from "@mui/material";
import {
  MediaDetailsForm,
  type MediaDetailsFormValues,
} from "./MediaDetailsForm";
import { SavedMedia } from "@/types/media";
import { TmdbMovie, TmdbTvShow } from "@/types/tmdb";
import { addSavedMedia } from "@/services/media";

interface AddToCollectionFormProps {
  item: TmdbMovie | TmdbTvShow;
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

const defaultFormValues: MediaDetailsFormValues = {
  format: "DVD",
  condition: "",
  acquiredFrom: "",
  acquiredDate: "",
  pricePaid: "",
  notes: "",
  review: "",
  rating: "",
};

export const AddToCollectionForm = ({
  item,
  open,
  onClose,
  onSaved,
}: AddToCollectionFormProps) => {
  async function handleSubmit(values: MediaDetailsFormValues) {
    const { id, ...rest } = item;
    const { imdb_id } = await fetch(
      `/api/tmdb/externalIds?mediaType=${item.media_type}&id=${id}`,
    ).then((r) => r.json());

    const newSavedMedia: SavedMedia = {
      ...rest,
      tmdbId: id,
      imdbId: imdb_id,
      ...values,
      pricePaid: values.pricePaid === "" ? 0 : values.pricePaid,
    };
    await addSavedMedia(newSavedMedia);
    onSaved?.();
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent>
        <MediaDetailsForm
          defaultValues={defaultFormValues}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
