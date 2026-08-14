"use client";

import { TmdbMultiResult } from "@/types/tmdb";
import { Button, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { PaddedPaper } from "./PaddedPaper";
import { useState } from "react";
import { SavedMedia } from "@/types/media";
import { ActionButton } from "./ActionButton";
import { AddToCollectionForm } from "./AddToCollectionForm";
import { deleteSavedMedia } from "@/services/media";
import localization from "@/locales/en";

type MediaCardProps =
  | { item: TmdbMultiResult; savedItem?: never }
  | { item?: never; savedItem: SavedMedia & { id: string } };

const POSTER_BASE = "https://image.tmdb.org/t/p/w154";

export const MediaCard = ({ item, savedItem }: MediaCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [removing, setRemoving] = useState(false);

  const media = item ?? savedItem;
  if (!media || media.media_type === "person") return null;
  if (item && item.media_type === "person") return null;

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
              <ActionButton
                onClick={() => setDialogOpen(true)}
                disabled={saved}
              >
                {saved
                  ? localization.mediaCard.added
                  : localization.mediaCard.addToCollection}
              </ActionButton>
              <ActionButton>
                {localization.mediaCard.addToWishlist}
              </ActionButton>
              <AddToCollectionForm
                item={item}
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSaved={() => setSaved(true)}
              />
            </>
          )}
          {savedItem && (
            <ActionButton onClick={handleRemove} disabled={removing}>
              {removing
                ? localization.mediaCard.removing
                : localization.mediaCard.remove}
            </ActionButton>
          )}
        </Stack>
      </Stack>
    </PaddedPaper>
  );
};
