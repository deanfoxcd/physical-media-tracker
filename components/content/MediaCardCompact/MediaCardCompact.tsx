"use client";

import { Link, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { SavedMedia, SavedMediaUpdates } from "@/types/media";
import { POSTER_BASE } from "@/constants/poster";
import { PaddedPaper } from "../../blocks/PaddedPaper";
import { SavedItemDialogs } from "../SavedItemDialogs";
import { useSavedItemDialogs } from "@/hooks/useSavedItemDialogs";
import { LiveTv, Movie } from "@mui/icons-material";
import { PriceDisplay } from "../../blocks/PriceDisplay";
import {
  detailsStackSX,
  iconsStackSX,
  mainStackSX,
  nameIconStackSX,
} from "./styles";

interface MediaCardCompactProps {
  savedItem: SavedMedia & { id: string };
  onUpdated?: (id: string, updates: SavedMediaUpdates) => void;
  onRemoved?: (id: string) => void;
}

export const MediaCardCompact = ({
  savedItem,
  onUpdated,
  onRemoved,
}: MediaCardCompactProps) => {
  const dialogs = useSavedItemDialogs(savedItem, onUpdated);
  const imdbLink = `https://www.imdb.com/title/${savedItem?.imdbId}/`;

  return (
    <PaddedPaper>
      <Stack
        direction="row"
        spacing={2}
        sx={mainStackSX}
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

        <Stack spacing={1} sx={nameIconStackSX}>
          <Link href={imdbLink} onClick={(e) => e.stopPropagation()}>
            {savedItem.media_type === "movie"
              ? savedItem.title
              : savedItem.name}
          </Link>

          <Stack direction="row" spacing={1} sx={iconsStackSX}>
            {savedItem.media_type === "movie" ? <Movie /> : <LiveTv />}
            <Typography>{savedItem.format}</Typography>
          </Stack>
        </Stack>

        {savedItem.status === "owned" ? (
          <Stack sx={detailsStackSX}>
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
        onRemoved={onRemoved}
      />
    </PaddedPaper>
  );
};
