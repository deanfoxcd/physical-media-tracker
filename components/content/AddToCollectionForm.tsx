import { Dialog, DialogContent } from "@mui/material";
import {
  MediaDetailsForm,
  type MediaDetailsFormValues,
} from "../blocks/MediaDetailsForm/MediaDetailsForm";
import { SavedMedia } from "@/types/media";
import { TmdbMovie, TmdbTvShow } from "@/types/tmdb";
import { addSavedMedia } from "@/services/media";
import { fetchImdbId } from "@/lib/tmdbClient";
import { DEFAULT_FORM_VALUES } from "@/constants/addToCollectionFormValues";
import { useAuth } from "@/contexts/AuthContext";

interface AddToCollectionFormProps {
  item: TmdbMovie | TmdbTvShow;
  open: boolean;
  onClose: () => void;
  onSaved?: (savedItem: SavedMedia & { id: string }) => void;
}

export const AddToCollectionForm = ({
  item,
  open,
  onClose,
  onSaved,
}: AddToCollectionFormProps) => {
  const { user } = useAuth();

  async function handleSubmit(values: MediaDetailsFormValues) {
    const { id, ...rest } = item;
    const imdbId = await fetchImdbId(item.media_type, id);

    const newSavedMedia: SavedMedia = {
      ...rest,
      tmdbId: id,
      imdbId,
      userId: user!.uid,
      status: "owned",
      ...values,
      pricePaid: values.pricePaid === "" ? 0 : values.pricePaid,
    };
    const savedItem = await addSavedMedia(newSavedMedia);
    onSaved?.(savedItem);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent>
        <MediaDetailsForm
          defaultValues={DEFAULT_FORM_VALUES}
          onSubmit={handleSubmit}
          onCancel={onClose}
          title={item.media_type === "movie" ? item.title : item.name}
        />
      </DialogContent>
    </Dialog>
  );
};
