"use client";

import {
  CircularProgress,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { ViewList, GridView } from "@mui/icons-material";
import { MediaCard } from "../blocks/MediaCard";
import { MediaCardCompact } from "../blocks/MediaCardCompact";
import localization from "@/locales/en";
import { SavedMedia, SavedMediaUpdates } from "@/types/media";

interface MediaListProps {
  title: string;
  items: (SavedMedia & { id: string })[];
  loading: boolean;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: SavedMediaUpdates) => void;
  layout: "grid" | "list";
  onLayoutChange: (layout: "grid" | "list") => void;
}

export const MediaList = ({
  title,
  items,
  loading,
  removeItem,
  updateItem,
  layout,
  onLayoutChange,
}: MediaListProps) => {
  if (loading) return <CircularProgress />;

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Typography variant="h4">{title}</Typography>

        <ToggleButtonGroup
          value={layout}
          exclusive
          onChange={(_, value) => value && onLayoutChange(value)}
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
        <Typography>{localization.collection.empty}</Typography>
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
