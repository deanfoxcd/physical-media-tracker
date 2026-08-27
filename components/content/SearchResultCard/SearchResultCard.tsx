"use client";

import { TmdbMultiResult } from "@/types/tmdb";
import {
  Button,
  Dialog,
  DialogContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { PaddedPaper } from "../../blocks/PaddedPaper";
import { useState } from "react";
import { SavedMedia, SavedMediaFields } from "@/types/media";
import { ActionButton } from "../../blocks/ActionButton";
import { AddToCollectionForm } from "../AddToCollectionForm";
import { addSavedMedia } from "@/services/media";
import localization from "@/locales/en";
import { LiveTv, Movie } from "@mui/icons-material";
import { fetchImdbId } from "@/lib/tmdbClient";
import { FORMAT_OPTIONS } from "@/constants/formatOptions";
import { POSTER_BASE } from "@/constants/poster";
import { useAuth } from "@/contexts/AuthContext";
import {
  iconsStackSX,
  innerStackSX,
  mainStackSX,
  resultTextSX,
  textSX,
  titleTextLinkSX,
} from "./styles";

interface SearchResultCardProps {
  item: TmdbMultiResult;
  onAdded?: (item: SavedMedia & { id: string }) => void;
  existingStatus?: "owned" | "wishlist";
}

export const SearchResultCard = ({
  item,
  onAdded,
  existingStatus,
}: SearchResultCardProps) => {
  const { user } = useAuth();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [wishlistDialogOpen, setWishlistDialogOpen] = useState(false);
  const [wishlistFormat, setWishlistFormat] =
    useState<SavedMediaFields["format"]>("DVD");
  const [wishlistNotes, setWishlistNotes] = useState("");
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [addedToWishlist, setAddedToWishlist] = useState(false);

  if (item.media_type === "person") return null;

  async function handleAddToWishlist() {
    if (item.media_type === "person") return;
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

  const addToCollectionButton = (
    <ActionButton onClick={() => setDialogOpen(true)} disabled={saved}>
      {saved
        ? localization.mediaCard.added
        : localization.mediaCard.addToCollection}
    </ActionButton>
  );

  return (
    <PaddedPaper>
      <Stack direction="row" spacing={2}>
        {item.poster_path && (
          <Image
            src={`${POSTER_BASE}${item.poster_path}`}
            alt={item.media_type === "movie" ? item.title : item.name}
            width={92}
            height={138}
          />
        )}
        <Stack spacing={1} sx={mainStackSX}>
          <Button onClick={() => console.log(item)} sx={titleTextLinkSX}>
            <Typography sx={resultTextSX}>
              {item.media_type === "movie" ? item.title : item.name} (
              {(item.media_type === "movie"
                ? item.release_date
                : item.first_air_date
              )?.slice(0, 4)}
              )
            </Typography>
          </Button>
          {existingStatus && (
            <Typography variant="caption" sx={textSX}>
              {existingStatus === "owned"
                ? "Also in your Collection"
                : "Also in your Wishlist"}
            </Typography>
          )}

          <Stack direction="row" spacing={2} sx={innerStackSX}>
            <Stack direction="row" spacing={1} sx={iconsStackSX}>
              {item.media_type === "movie" ? <Movie /> : <LiveTv />}
            </Stack>

            <Stack direction="row" spacing={1}>
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
              {addToCollectionButton}
            </Stack>

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
          </Stack>
        </Stack>
      </Stack>
    </PaddedPaper>
  );
};
