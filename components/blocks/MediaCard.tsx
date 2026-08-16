"use client";

import { TmdbMultiResult } from "@/types/tmdb";
import {
  Button,
  Dialog,
  DialogContent,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { PaddedPaper } from "./PaddedPaper";
import { useState } from "react";
import { SavedMedia, SavedMediaFields, SavedMediaUpdates } from "@/types/media";
import { ActionButton } from "./ActionButton";
import { AddToCollectionForm } from "./AddToCollectionForm";
import {
  addSavedMedia,
  deleteSavedMedia,
  updateSavedMedia,
} from "@/services/media";
import localization from "@/locales/en";
import { SavedMediaDetails } from "./SavedMediaDetails";
import { LiveTv, Movie } from "@mui/icons-material";
import { fetchImdbId } from "@/lib/tmdbClient";
import { FORMAT_OPTIONS } from "@/constants/formatOptions";
import { MediaDetailsForm, MediaDetailsFormValues } from "./MediaDetailsForm";
import { POSTER_BASE } from "@/constants/poster";
import { DEFAULT_FORM_VALUES } from "@/constants/addToCollectionFormValues";

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

export const MediaCard = ({
  item,
  savedItem,
  onRemoved,
  onUpdated,
}: MediaCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [moveToCollectionOpen, setMoveToCollectionOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [wishlistAnchorEl, setWishlistAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [addedToWishlist, setAddedToWishlist] = useState(false);

  const media = item ?? savedItem;
  if (!media || media.media_type === "person") return null;
  if (item && item.media_type === "person") return null;

  async function handleAddToWishlist(format: SavedMediaFields["format"]) {
    if (!item || item.media_type === "person") return;

    setWishlistAnchorEl(null);
    setAddingToWishlist(true);
    try {
      const { id, ...rest } = item;
      const imdbId = await fetchImdbId(item.media_type, id);
      const newSavedMedia: SavedMedia = {
        ...rest,
        tmdbId: id,
        imdbId,
        status: "wishlist",
        format,
      };
      await addSavedMedia(newSavedMedia);
      setAddedToWishlist(true);
    } finally {
      setAddingToWishlist(false);
    }
  }

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

  async function handleMoveToCollection(values: MediaDetailsFormValues) {
    if (!savedItem) return;
    const updates: SavedMediaUpdates = {
      ...values,
      status: "owned",
      pricePaid: values.pricePaid === "" ? 0 : values.pricePaid,
    };
    await updateSavedMedia(savedItem.id, updates, "Moved to Collection");
    onUpdated?.(savedItem.id, updates);
    setMoveToCollectionOpen(false);
  }

  const seeDetailsButton = (
    <ActionButton onClick={() => setDetailsOpen(true)}>
      See details
    </ActionButton>
  );

  const addToCollectionButton = (
    <ActionButton onClick={() => setDialogOpen(true)} disabled={saved}>
      {saved
        ? localization.mediaCard.added
        : localization.mediaCard.addToCollection}
    </ActionButton>
  );

  const moveToCollectionButton = (
    <ActionButton onClick={() => setMoveToCollectionOpen(true)}>
      {localization.mediaCard.addToCollection}
    </ActionButton>
  );

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
                {addToCollectionButton}
                <ActionButton
                  onClick={(e) => setWishlistAnchorEl(e.currentTarget)}
                  disabled={addingToWishlist || addedToWishlist}
                >
                  {addedToWishlist
                    ? localization.mediaCard.added
                    : addingToWishlist
                      ? localization.mediaCard.adding
                      : localization.mediaCard.addToWishlist}
                </ActionButton>
                <Menu
                  anchorEl={wishlistAnchorEl}
                  open={Boolean(wishlistAnchorEl)}
                  onClose={() => setWishlistAnchorEl(null)}
                >
                  {FORMAT_OPTIONS.map((format) => (
                    <MenuItem
                      key={format}
                      onClick={() => handleAddToWishlist(format)}
                    >
                      {format}
                    </MenuItem>
                  ))}
                </Menu>
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
                  {savedItem.status === "owned"
                    ? seeDetailsButton
                    : moveToCollectionButton}
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
                <Dialog
                  open={moveToCollectionOpen}
                  onClose={() => setMoveToCollectionOpen(false)}
                  fullWidth
                  maxWidth="sm"
                >
                  <DialogContent>
                    <MediaDetailsForm
                      defaultValues={{
                        ...DEFAULT_FORM_VALUES,
                        format: savedItem.format,
                      }}
                      onSubmit={handleMoveToCollection}
                      onCancel={() => setMoveToCollectionOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
    </PaddedPaper>
  );
};
