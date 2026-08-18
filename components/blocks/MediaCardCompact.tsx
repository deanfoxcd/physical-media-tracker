"use client";

import { Link, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { SavedMedia, SavedMediaUpdates } from "@/types/media";
import { POSTER_BASE } from "@/constants/poster";
import { PaddedPaper } from "./PaddedPaper";
import { SavedItemDialogs } from "./SavedItemDialogs";
import { useSavedItemDialogs } from "@/hooks/useSavedItemDialogs";
import { LiveTv, Movie } from "@mui/icons-material";
import { PriceDisplay } from "./PriceDisplay";

interface MediaCardCompactProps {
  savedItem: SavedMedia & { id: string };
  onUpdated?: (id: string, updates: SavedMediaUpdates) => void;
}

export const MediaCardCompact = ({
  savedItem,
  onUpdated,
}: MediaCardCompactProps) => {
  const dialogs = useSavedItemDialogs(savedItem, onUpdated);
  const imdbLink = `https://www.imdb.com/title/${savedItem?.imdbId}/`;

  return (
    <PaddedPaper>
      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: "center", cursor: "pointer" }}
        onClick={dialogs.openPrimary}
      >
        {savedItem.poster_path && (
          <Image
            src={`${POSTER_BASE}${savedItem.poster_path}`}
            alt={
              savedItem.media_type === "movie"
                ? savedItem.title
                : savedItem.name
            }
            width={60}
            height={90}
          />
        )}

        <Stack spacing={1} sx={{ flexGrow: 1 }}>
          <Link href={imdbLink} onClick={(e) => e.stopPropagation()}>
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
        </Stack>

        {savedItem.status === "owned" ? (
          <Stack sx={{ justifyContent: "end" }}>
            <Typography>{savedItem.acquiredFrom}</Typography>
            <Typography>{savedItem.acquiredDate}</Typography>
            <PriceDisplay price={savedItem.pricePaid ?? 0} />
          </Stack>
        ) : null}
      </Stack>

      <SavedItemDialogs
        savedItem={savedItem}
        detailsOpen={dialogs.detailsOpen}
        onDetailsClose={() => dialogs.setDetailsOpen(false)}
        moveToCollectionOpen={dialogs.moveToCollectionOpen}
        onMoveToCollectionClose={() => dialogs.setMoveToCollectionOpen(false)}
        onMoveToCollectionSubmit={dialogs.handleMoveToCollection}
        onUpdated={onUpdated}
      />
    </PaddedPaper>
  );
};
