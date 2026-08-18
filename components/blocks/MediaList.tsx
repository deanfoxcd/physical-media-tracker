"use client";

import {
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { ViewList, GridView } from "@mui/icons-material";
import { MediaCard } from "../blocks/MediaCard";
import { MediaCardCompact } from "../blocks/MediaCardCompact";
import localization from "@/locales/en";
import { SavedMedia, SavedMediaUpdates } from "@/types/media";
import { useMemo, useState } from "react";
import { SortOption } from "@/types/sort";
import { sortSavedMedia } from "@/lib/sortMedia";
import { SORT_OPTIONS } from "@/constants/sortOptions";

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
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");
  const sortedItems = useMemo(
    () => sortSavedMedia(items, sortOption),
    [items, sortOption],
  );

  if (loading) return <CircularProgress />;

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Typography variant="h4">{title}</Typography>

        <Stack direction="row" spacing={1}>
          <TextField
            select
            label="Sort by"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            sx={{ minWidth: 220 }}
          >
            {SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

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
      </Stack>

      {sortedItems.length === 0 ? (
        <Typography>{localization.collection.empty}</Typography>
      ) : layout === "grid" ? (
        <Stack spacing={3} direction="row" sx={{ flexWrap: "wrap" }} useFlexGap>
          {sortedItems.map((item) => (
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
          {sortedItems.map((item) => (
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
