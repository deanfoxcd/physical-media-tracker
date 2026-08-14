import { TmdbMultiResult } from "@/types/tmdb";
import { Button, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { ButtonSolid } from "./ButtonSolid";
import { PaddedPaper } from "./PaddedPaper";
import { useState } from "react";
import { SavedMedia } from "@/types/media";
import { addSavedMedia, deleteSavedMedia } from "@/services/media";
import localization from "@/locales/en";

type MediaCardProps =
  | { item: TmdbMultiResult; savedItem?: never }
  | { item?: never; savedItem: SavedMedia & { id: string } };

const POSTER_BASE = "https://image.tmdb.org/t/p/w154";

export const MediaCard = ({ item, savedItem }: MediaCardProps) => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [removing, setRemoving] = useState(false);

  const media = item ?? savedItem;
  if (!media || media.media_type === "person") return null;

  async function handleAddToCollection() {
    if (!item || item.media_type === "person") return;

    const { id, ...rest } = item;
    const newSavedMedia: SavedMedia = {
      ...rest,
      tmdbId: id,
      format: "dvd",
      condition: "",
      acquiredFrom: "",
      acquiredDate: "",
      pricePaid: 0,
      notes: "",
      review: "",
    };

    setSaving(true);
    try {
      await addSavedMedia(newSavedMedia);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove() {
    if (!savedItem) return;
    setRemoving(true);
    try {
      await deleteSavedMedia(savedItem.id);
    } finally {
      setRemoving(false);
    }
  }

  return (
    <PaddedPaper>
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Stack direction="row" spacing={2}>
          {media.poster_path && (
            <Image
              src={`${POSTER_BASE}${media.poster_path}`}
              alt={media.media_type === "movie" ? media.title : media.name}
              width={92}
              height={138}
            />
          )}
          <Button onClick={() => console.log(media)}>
            <Typography>
              {media.media_type === "movie" ? media.title : media.name} (
              {(media.media_type === "movie"
                ? media.release_date
                : media.first_air_date
              )?.slice(0, 4)}
              )
            </Typography>
          </Button>
        </Stack>

        <Stack spacing={1}>
          {item && (
            <>
              <ButtonSolid
                onClick={handleAddToCollection}
                disabled={saving || saved}
              >
                {saved
                  ? localization.mediaCard.added
                  : saving
                    ? localization.mediaCard.adding
                    : localization.mediaCard.addToCollection}
              </ButtonSolid>
              <ButtonSolid>Add to Watchlist</ButtonSolid>
            </>
          )}
          {savedItem && (
            <ButtonSolid onClick={handleRemove} disabled={removing}>
              {removing ? "Removing..." : "Remove"}
            </ButtonSolid>
          )}
        </Stack>
      </Stack>
    </PaddedPaper>
  );
};
