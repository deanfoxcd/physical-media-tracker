"use client";

import { CircularProgress, Stack, Typography } from "@mui/material";
import localization from "@/locales/en";
import { MediaCard } from "../blocks/MediaCard";
import { SavedMedia, SavedMediaUpdates } from "@/types/media";

interface CollectionProps {
  items: (SavedMedia & { id: string })[];
  loading: boolean;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: SavedMediaUpdates) => void;
}

export const Collection = ({
  items,
  loading,
  removeItem,
  updateItem,
}: CollectionProps) => {
  if (loading) return <CircularProgress />;

  return (
    <Stack spacing={2}>
      <Typography variant="h4" sx={{ alignItems: "center" }}>
        {localization.collection.title}
      </Typography>

      {items.length === 0 ? (
        <Typography>No saved items yet.</Typography>
      ) : (
        <Stack spacing={2}>
          <Stack
            spacing={3}
            direction="row"
            sx={{ flexWrap: "wrap" }}
            useFlexGap
          >
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
      )}
    </Stack>
  );
};
