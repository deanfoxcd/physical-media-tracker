"use client";

import { TmdbMultiResult } from "@/types/tmdb";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Link,
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
      onAdded?: (item: SavedMedia & { id: string }) => void;
      layout?: never;
    }
  | {
      item?: never;
      savedItem: SavedMedia & { id: string };
      onRemoved: (id: string) => void;
      onUpdated?: (id: string, updates: SavedMediaUpdates) => void;
      onAdded?: never;
      layout?: "list" | "grid";
    };

export const MediaCard = ({
  item,
  savedItem,
  onRemoved,
  onUpdated,
  onAdded,
  layout = "grid",
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
  const imdbLink = `https://www.imdb.com/title/${savedItem?.imdbId}/`;

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
      const savedItem = await addSavedMedia(newSavedMedia);
      setAddedToWishlist(true);
      onAdded?.(savedItem);
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

  const removeButton = (
    <ActionButton onClick={handleRemove} disabled={removing}>
      {removing
        ? localization.mediaCard.removing
        : localization.mediaCard.remove}
    </ActionButton>
  );

  const primaryButton =
    savedItem?.status === "owned" ? seeDetailsButton : moveToCollectionButton;

  if (savedItem && layout === "grid") {
    return (
      <PaddedPaper>
        <Stack spacing={1} sx={{ width: 180, alignItems: "center" }}>
          {media.poster_path && (
            <Box
              onClick={() =>
                savedItem.status === "owned"
                  ? setDetailsOpen(true)
                  : setMoveToCollectionOpen(true)
              }
              sx={{ cursor: "pointer" }}
            >
              <Image
                src={`${POSTER_BASE}${media.poster_path}`}
                alt={media.media_type === "movie" ? media.title : media.name}
                width={154}
                height={231}
              />
            </Box>
          )}
          <Link
            align="center"
            href={imdbLink}
            onClick={(e) => {
              e.stopPropagation();
            }}
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              height: "3em",
              lineHeight: "1.5em",
            }}
          >
            {media.media_type === "movie" ? media.title : media.name}
          </Link>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center", mt: "auto" }}
          >
            {media.media_type === "movie" ? <Movie /> : <LiveTv />}
            <Typography>{savedItem.format}</Typography>
          </Stack>
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
      </PaddedPaper>
    );
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
          <Stack sx={{ justifyContent: "center" }}>
            {media === savedItem ? (
              <Typography>{media.format}</Typography>
            ) : null}
            {media.media_type === "movie" ? <Movie /> : <LiveTv />}
          </Stack>

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
                  onSaved={(savedItem) => {
                    setSaved(true);
                    onAdded?.(savedItem);
                  }}
                />
              </>
            )}

            {savedItem && (
              <Stack spacing={1} sx={{ justifyContent: "center" }}>
                <Stack spacing={2}>
                  {primaryButton}
                  {removeButton}
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
