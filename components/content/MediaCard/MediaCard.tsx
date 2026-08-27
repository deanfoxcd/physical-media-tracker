"use client";

import {
  Box,
  Dialog,
  DialogContent,
  Link,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import { PaddedPaper } from "../../blocks/PaddedPaper";
import { useState } from "react";
import { SavedMedia, SavedMediaUpdates } from "@/types/media";
import { SavedMediaDetails } from "../SavedMediaDetails/SavedMediaDetails";
import { LiveTv, Movie } from "@mui/icons-material";
import {
  MediaDetailsForm,
  MediaDetailsFormValues,
} from "../../blocks/MediaDetailsForm/MediaDetailsForm";
import { POSTER_BASE } from "@/constants/poster";
import { DEFAULT_FORM_VALUES } from "@/constants/addToCollectionFormValues";
import { deleteSavedMedia, updateSavedMedia } from "@/services/media";

interface MediaCardProps {
  savedItem: SavedMedia & { id: string };
  onUpdated?: (id: string, updates: SavedMediaUpdates) => void;
  onRemoved?: (id: string) => void;
}

export const MediaCard = ({
  savedItem,
  onUpdated,
  onRemoved,
}: MediaCardProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [moveToCollectionOpen, setMoveToCollectionOpen] = useState(false);

  const imdbLink = `https://www.imdb.com/title/${savedItem.imdbId}/`;

  async function handleMoveToCollection(values: MediaDetailsFormValues) {
    const updates: SavedMediaUpdates = {
      ...values,
      status: "owned",
      pricePaid: values.pricePaid === "" ? 0 : values.pricePaid,
    };
    await updateSavedMedia(savedItem.id, updates, "Moved to Collection");
    onUpdated?.(savedItem.id, updates);
    setMoveToCollectionOpen(false);
  }

  async function handleRemoveFromWishlist() {
    await deleteSavedMedia(savedItem.id);
    onRemoved?.(savedItem.id);
    setMoveToCollectionOpen(false);
  }

  const posterWidth = isMobile ? 140 : 154;
  const posterHeight = isMobile ? 210 : 231;

  return (
    <PaddedPaper>
      <Stack
        spacing={1}
        sx={{ width: isMobile ? 136 : 180, alignItems: "center" }}
      >
        {savedItem.poster_path && (
          <Box
            onClick={() =>
              savedItem.status === "owned"
                ? setDetailsOpen(true)
                : setMoveToCollectionOpen(true)
            }
            sx={{ cursor: "pointer" }}
          >
            <Image
              src={`${POSTER_BASE}${savedItem.poster_path}`}
              alt={
                savedItem.media_type === "movie"
                  ? savedItem.title
                  : savedItem.name
              }
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
              {savedItem.media_type === "movie"
                ? savedItem.title
                : savedItem.name}
            </Link>
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: "center", mt: "auto" }}
            >
              {savedItem.media_type === "movie" ? <Movie /> : <LiveTv />}
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
        onRemoved={onRemoved}
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
            title={
              savedItem.media_type === "movie"
                ? savedItem.title
                : savedItem.name
            }
            onDelete={handleRemoveFromWishlist}
            deleteLabel="Remove from Wishlist"
          />
        </DialogContent>
      </Dialog>
    </PaddedPaper>
  );
};
