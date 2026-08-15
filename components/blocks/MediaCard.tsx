"use client";

import { TmdbMultiResult } from "@/types/tmdb";
import { Button, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { PaddedPaper } from "./PaddedPaper";
import { useState } from "react";
import { SavedMedia, SavedMediaUpdates } from "@/types/media";
import { ActionButton } from "./ActionButton";
import { AddToCollectionForm } from "./AddToCollectionForm";
import { deleteSavedMedia } from "@/services/media";
import localization from "@/locales/en";
import { SavedMediaDetails } from "./SavedMediaDetails";
import { LiveTv, Movie } from "@mui/icons-material";

type MediaCardProps =
  | {
      item: TmdbMultiResult;
      savedItem?: never;
      onRemoved?: never;
      onUpdated?: never;
    }
  | {
      item?: never;
      savedItem: SavedMedia & { id: string };
      onRemoved: (id: string) => void;
      onUpdated?: (id: string, updates: SavedMediaUpdates) => void;
    };

const POSTER_BASE = "https://image.tmdb.org/t/p/w154";

export const MediaCard = ({
  item,
  savedItem,
  onRemoved,
  onUpdated,
}: MediaCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
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
      onRemoved?.(savedItem.id);
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

        <Stack direction="row" spacing={12}>
          {media === savedItem ? (
            <Stack sx={{ justifyContent: "center" }}>
              <Stack direction="row" spacing={1}>
                <Typography>{localization.savedMediaDetails.format}</Typography>
                <Typography>{media.format}</Typography>
              </Stack>
              {media.media_type === "movie" ? <Movie /> : <LiveTv />}
            </Stack>
          ) : null}
          <Stack spacing={1} sx={{ justifyContent: "center" }}>
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
              <Stack spacing={1} sx={{ justifyContent: "center" }}>
                <Stack spacing={2}>
                  <ActionButton onClick={() => setDetailsOpen(true)}>
                    See details
                  </ActionButton>
                  <ActionButton onClick={handleRemove} disabled={removing}>
                    {removing
                      ? localization.mediaCard.removing
                      : localization.mediaCard.remove}
                  </ActionButton>
                </Stack>
                <SavedMediaDetails
                  savedItem={savedItem}
                  open={detailsOpen}
                  onClose={() => setDetailsOpen(false)}
                  onUpdated={onUpdated}
                />
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
    </PaddedPaper>
  );
};
