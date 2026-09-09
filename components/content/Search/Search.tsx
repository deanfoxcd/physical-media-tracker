"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ClickAwayListener,
  Paper,
  Popper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import localization from "@/locales/en";
import { useMovieSearch } from "@/hooks/useSearch";
import { ActionButton } from "../../blocks/ActionButton";
import { SearchResultCard } from "../SearchResultCard/SearchResultCard";
import { SavedMedia } from "@/types/media";
import { TmdbMultiResult } from "@/types/tmdb";
import { DEBOUNCE_MS, PREVIEW_LIMIT } from "@/constants/search";
import { mainStackSX, paperSX, popperSX } from "./styles";

interface SearchProps {
  onAdded?: (item: SavedMedia & { id: string }) => void;
  savedItems?: (SavedMedia & { id: string })[];
}

export const Search = ({ onAdded, savedItems }: SearchProps) => {
  const router = useRouter();
  const { query, setQuery, results, loading, search } = useMovieSearch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!query.trim()) return;

    const timeout = setTimeout(() => {
      search(query);
      setDropdownOpen(true);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function getExistingStatus(item: TmdbMultiResult) {
    if (item.media_type === "person") return undefined;
    return savedItems?.find(
      (saved) =>
        saved.tmdbId === item.id && saved.media_type === item.media_type,
    )?.status;
  }

  function handleShowMore() {
    setDropdownOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  const previewResults = results
    .filter((r) => r.media_type === "movie" || r.media_type === "tv")
    .slice(0, PREVIEW_LIMIT);

  return (
    <Stack
      ref={(node) => setAnchorEl(node as HTMLDivElement | null)}
      spacing={1}
      sx={mainStackSX}
    >
      <Typography>{localization.searchInstructions}</Typography>

      <Stack spacing={2}>
        <TextField
          label={localization.search.label}
          variant="outlined"
          value={query}
          size="small"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              search();
              setDropdownOpen(true);
            }
            if (e.key === "Escape") setDropdownOpen(false);
          }}
        />
        <ActionButton
          size="small"
          onClick={() => {
            search();
            setDropdownOpen(true);
          }}
          disabled={loading}
        >
          {loading
            ? localization.search.searchLoading
            : localization.search.buttonText}
        </ActionButton>
      </Stack>

      <Popper
        open={dropdownOpen && query.trim() !== "" && previewResults.length > 0}
        anchorEl={anchorEl}
        placement="bottom-start"
        sx={popperSX}
        modifiers={[
          {
            name: "sameWidth",
            enabled: true,
            phase: "beforeWrite",
            requires: ["computeStyles"],
            fn: ({ state }) => {
              state.styles.popper.width = `${state.rects.reference.width}px`;
            },
          },
        ]}
      >
        <ClickAwayListener onClickAway={() => setDropdownOpen(false)}>
          <Paper elevation={4} sx={paperSX}>
            <Stack spacing={1}>
              {previewResults.map((item) => (
                <SearchResultCard
                  key={item.id}
                  item={item}
                  onAdded={onAdded}
                  existingStatus={getExistingStatus(item)}
                />
              ))}
              <ActionButton onClick={handleShowMore} minor>
                Show More
              </ActionButton>
            </Stack>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Stack>
  );
};
