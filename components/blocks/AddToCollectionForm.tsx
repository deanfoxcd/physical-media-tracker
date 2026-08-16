import { Dialog, DialogContent } from "@mui/material";
import {
  MediaDetailsForm,
  type MediaDetailsFormValues,
} from "./MediaDetailsForm";
import { SavedMedia } from "@/types/media";
import { TmdbMovie, TmdbTvShow } from "@/types/tmdb";
import { addSavedMedia } from "@/services/media";
import { fetchImdbId } from "@/lib/tmdbClient";
import { DEFAULT_FORM_VALUES } from "@/constants/addToCollectionFormValues";

interface AddToCollectionFormProps {
  item: TmdbMovie | TmdbTvShow;
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const AddToCollectionForm = ({
  item,
  open,
  onClose,
  onSaved,
}: AddToCollectionFormProps) => {
  async function handleSubmit(values: MediaDetailsFormValues) {
    const { id, ...rest } = item;
    const imdbId = await fetchImdbId(item.media_type, id);

    const newSavedMedia: SavedMedia = {
      ...rest,
      tmdbId: id,
      imdbId,
      status: "owned",
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
          defaultValues={DEFAULT_FORM_VALUES}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
