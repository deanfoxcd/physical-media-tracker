"use client";

import { TmdbMultiResult } from "@/types/tmdb";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Link,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
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
import { useAuth } from "@/contexts/AuthContext";

type MediaCardProps =
  | {
      item: TmdbMultiResult;
      savedItem?: never;
      onRemoved?: never;
      onUpdated?: never;
      onAdded?: (item: SavedMedia & { id: string }) => void;
      existingStatus?: "owned" | "wishlist";
      layout?: never;
    }
  | {
      item?: never;
      savedItem: SavedMedia & { id: string };
      onRemoved: (id: string) => void;
      onUpdated?: (id: string, updates: SavedMediaUpdates) => void;
      onAdded?: never;
      existingStatus?: never;
      layout?: "list" | "grid";
    };

export const MediaCard = ({
  item,
  savedItem,
  onRemoved,
  onUpdated,
  onAdded,
  existingStatus,
  layout = "grid",
}: MediaCardProps) => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [moveToCollectionOpen, setMoveToCollectionOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [wishlistDialogOpen, setWishlistDialogOpen] = useState(false);
  const [wishlistFormat, setWishlistFormat] =
    useState<SavedMediaFields["format"]>("DVD");
  const [wishlistNotes, setWishlistNotes] = useState("");
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [addedToWishlist, setAddedToWishlist] = useState(false);

  const media = item ?? savedItem;
  if (!media || media.media_type === "person") return null;
  if (item && item.media_type === "person") return null;
  const imdbLink = `https://www.imdb.com/title/${savedItem?.imdbId}/`;

  async function handleAddToWishlist() {
    if (!item || item.media_type === "person") return;
    setWishlistDialogOpen(false);
    setAddingToWishlist(true);
    try {
      const { id, ...rest } = item;
      const imdbId = await fetchImdbId(item.media_type, id);
      const newSavedMedia: SavedMedia = {
        ...rest,
        tmdbId: id,
        imdbId,
        userId: user!.uid,
        status: "wishlist",
        format: wishlistFormat,
        notes: wishlistNotes,
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
    const posterWidth = isMobile ? 140 : 154;
    const posterHeight = isMobile ? 210 : 231;

    const content = (
      <>
        <Stack
          spacing={1}
          sx={{ width: isMobile ? 136 : 180, alignItems: "center" }}
        >
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
                width={posterWidth}
                height={posterHeight}
              />
            </Box>
          )}
          {!isMobile && (
            <>
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
            </>
          )}
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
                notes: savedItem.notes ?? "",
              }}
              onSubmit={handleMoveToCollection}
              onCancel={() => setMoveToCollectionOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </>
    );

    return isMobile ? content : <PaddedPaper>{content}</PaddedPaper>;
  }

  return (
    <PaddedPaper>
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", flexWrap: "wrap" }}
      >
        <Stack direction="row" spacing={2}>
          {media.poster_path && (
            <Image
              src={`${POSTER_BASE}${media.poster_path}`}
              alt={media.media_type === "movie" ? media.title : media.name}
              width={92}
              height={138}
            />
          )}
          <Stack>
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
            {existingStatus && (
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {existingStatus === "owned"
                  ? "Also in your Collection"
                  : "Also in your Wishlist"}
              </Typography>
            )}
          </Stack>
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
                  onClick={() => setWishlistDialogOpen(true)}
                  disabled={addingToWishlist || addedToWishlist}
                >
                  {addedToWishlist
                    ? localization.mediaCard.added
                    : addingToWishlist
                      ? localization.mediaCard.adding
                      : localization.mediaCard.addToWishlist}
                </ActionButton>
                <Dialog
                  open={wishlistDialogOpen}
                  onClose={() => setWishlistDialogOpen(false)}
                  fullWidth
                  maxWidth="sm"
                >
                  <DialogContent>
                    <Stack spacing={2}>
                      <Typography variant="h6">Add to Wishlist</Typography>
                      <TextField
                        label="Format:"
                        select
                        slotProps={{
                          select: { MenuProps: { disablePortal: true } },
                        }}
                        value={wishlistFormat}
                        onChange={(e) =>
                          setWishlistFormat(
                            e.target.value as SavedMediaFields["format"],
                          )
                        }
                      >
                        {FORMAT_OPTIONS.map((format) => (
                          <MenuItem key={format} value={format}>
                            {format}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        label="Notes:"
                        multiline
                        value={wishlistNotes}
                        onChange={(e) => setWishlistNotes(e.target.value)}
                      />
                      <Stack direction="row" spacing={2}>
                        <ActionButton onClick={handleAddToWishlist}>
                          Add to Wishlist
                        </ActionButton>
                        <ActionButton
                          onClick={() => setWishlistDialogOpen(false)}
                          minor
                        >
                          Cancel
                        </ActionButton>
                      </Stack>
                    </Stack>
                  </DialogContent>
                </Dialog>
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
