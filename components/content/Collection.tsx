"use client";

import {
  CircularProgress,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import localization from "@/locales/en";
import { MediaCard } from "../blocks/MediaCard";
import { SavedMedia, SavedMediaUpdates } from "@/types/media";
import { useState } from "react";
import { GridView, ViewList } from "@mui/icons-material";
import { MediaCardCompact } from "../blocks/MediaCardCompact";

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
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  if (loading) return <CircularProgress />;

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Typography variant="h4" sx={{ alignItems: "center" }}>
          {localization.collection.title}
        </Typography>

        <ToggleButtonGroup
          value={layout}
          exclusive
          onChange={(_, value) => value && setLayout(value)}
        >
          <ToggleButton value="grid">
            <GridView />
          </ToggleButton>
          <ToggleButton value="list">
            <ViewList />
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {items.length === 0 ? (
        <Typography>No saved items yet.</Typography>
      ) : layout === "grid" ? (
        <Stack spacing={3} direction="row" sx={{ flexWrap: "wrap" }} useFlexGap>
          {items.map((item) => (
            <MediaCard
              key={item.id}
              savedItem={item}
              onRemoved={removeItem}
              onUpdated={updateItem}
            />
          ))}
        </Stack>
      ) : (
        <Stack spacing={1}>
          {items.map((item) => (
            <MediaCardCompact
              key={item.id}
              savedItem={item}
              onUpdated={updateItem}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
};
