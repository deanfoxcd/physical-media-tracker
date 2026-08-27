"use client";

import {
  Chip,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ViewList, GridView, Movie, LiveTv } from "@mui/icons-material";
import { MediaCard } from "../MediaCard/MediaCard";
import { MediaCardCompact } from "../MediaCardCompact/MediaCardCompact";
import localization from "@/locales/en";
import { SavedMedia, SavedMediaUpdates } from "@/types/media";
import { useMemo, useState } from "react";
import { SortOption } from "@/types/sort";
import { sortSavedMedia } from "@/lib/sortMedia";
import { SORT_OPTIONS } from "@/constants/sortOptions";
import {
  chipsStackSX,
  chipsSX,
  controlsStackSX,
  gridStackSX,
  layoutButtonsStackSX,
  sortLabelSX,
  toggleButtonSX,
} from "./styles";

interface MediaListProps {
  title: string;
  items: (SavedMedia & { id: string })[];
  loading: boolean;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: SavedMediaUpdates) => void;
  layout: "grid" | "list";
  onLayoutChange: (layout: "grid" | "list") => void;
  status: "owned" | "wishlist";
}

export const MediaList = ({
  items,
  loading,
  removeItem,
  updateItem,
  layout,
  onLayoutChange,
  status,
}: MediaListProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [sortOption, setSortOption] = useState<SortOption>("name-asc");
  const [mediaTypeFilter, setMediaTypeFilter] = useState<
    "movie" | "tv" | "all"
  >("all");
  const sortOptions =
    status === "wishlist"
      ? SORT_OPTIONS.filter((option) => option.value.startsWith("name-"))
      : SORT_OPTIONS;
  const movieCount = items.filter((item) => item.media_type === "movie").length;
  const tvShowCount = items.filter((item) => item.media_type === "tv").length;

  const filteredItems = useMemo(
    () =>
      mediaTypeFilter === "all"
        ? items
        : items.filter((item) => item.media_type === mediaTypeFilter),
    [items, mediaTypeFilter],
  );

  const sortedItems = useMemo(
    () => sortSavedMedia(filteredItems, sortOption),
    [filteredItems, sortOption],
  );

  function toggleFilter(type: "movie" | "tv") {
    setMediaTypeFilter((prev) => (prev === type ? "all" : type));
  }

  if (loading) return <CircularProgress />;

  return (
    <Stack spacing={2}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={controlsStackSX}
      >
        <Stack direction="row" spacing={1} sx={chipsStackSX}>
          <Chip
            icon={<Movie />}
            label={`${movieCount} movies`}
            onClick={() => toggleFilter("movie")}
            color={mediaTypeFilter === "movie" ? "primary" : "default"}
            variant={mediaTypeFilter === "movie" ? "filled" : "outlined"}
            sx={chipsSX}
          />
          <Chip
            icon={<LiveTv />}
            label={`${tvShowCount} TV shows`}
            onClick={() => toggleFilter("tv")}
            color={mediaTypeFilter === "tv" ? "primary" : "default"}
            variant={mediaTypeFilter === "tv" ? "filled" : "outlined"}
            sx={chipsSX}
          />
        </Stack>

        <Stack direction="row" spacing={1} sx={layoutButtonsStackSX(isMobile)}>
          <TextField
            select
            label="Sort by"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            sx={sortLabelSX}
            size={isMobile ? "small" : "medium"}
          >
            {sortOptions.map((option) => (
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
            <ToggleButton value="grid" sx={toggleButtonSX(isMobile)}>
              <GridView />
            </ToggleButton>
            <ToggleButton value="list" sx={toggleButtonSX(isMobile)}>
              <ViewList />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>

      {sortedItems.length === 0 ? (
        <Typography>{localization.collection.empty}</Typography>
      ) : layout === "grid" ? (
        <Stack spacing={3} direction="row" sx={gridStackSX} useFlexGap>
          {sortedItems.map((item) => (
            <MediaCard
              key={item.id}
              savedItem={item}
              onUpdated={updateItem}
              onRemoved={removeItem}
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
              onRemoved={removeItem}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
};
