"use client";

import { CircularProgress, Stack, Typography } from "@mui/material";
import { MediaCard } from "../blocks/MediaCard";
import localization from "../../locales/en";
import { SavedMedia, SavedMediaUpdates } from "@/types/media";

interface WishlistProps {
  items: (SavedMedia & { id: string })[];
  loading: boolean;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: SavedMediaUpdates) => void;
}

export const Wishlist = ({
  items,
  loading,
  removeItem,
  updateItem,
}: WishlistProps) => {
  return loading ? (
    <CircularProgress />
  ) : (
    <Stack spacing={2}>
      <Typography variant="h4">{localization.collection.title}</Typography>

      <Stack spacing={2}>
        {items.map((item) => (
          <MediaCard
            key={item.id}
            savedItem={item}
            onRemoved={removeItem}
            onUpdated={updateItem}
          />
        ))}
      </Stack>
    </Stack>
  );
};
