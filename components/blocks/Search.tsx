"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  ClickAwayListener,
  Paper,
  Popper,
  Stack,
  TextField,
} from "@mui/material";
import localization from "@/locales/en";
import { useMovieSearch } from "@/hooks/useSearch";
import { ActionButton } from "./ActionButton";
import { MediaCard } from "./MediaCard";
import { SavedMedia } from "@/types/media";

const PREVIEW_LIMIT = 7;
const DEBOUNCE_MS = 500;

interface SearchProps {
  onAdded?: (item: SavedMedia & { id: string }) => void;
}

export const Search = ({ onAdded }: SearchProps) => {
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

  // async function handleSearch() {
  //   await search();
  //   setDropdownOpen(true);
  // }

  function handleShowMore() {
    setDropdownOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  const previewResults = results
    .filter((r) => r.media_type === "movie" || r.media_type === "tv")
    .slice(0, PREVIEW_LIMIT);

  return (
    <Box ref={(node) => setAnchorEl(node as HTMLDivElement | null)}>
      <Stack spacing={2}>
        <TextField
          label={localization.search.label}
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              search();
              setDropdownOpen(true);
            }
            if (e.key === "Escape") setDropdownOpen(false);
          }}
        />
        <Button
          variant="contained"
          onClick={() => {
            search();
            setDropdownOpen(true);
          }}
          disabled={loading}
        >
          {loading
            ? localization.search.searchLoading
            : localization.search.buttonText}
        </Button>
      </Stack>

      <Popper
        open={dropdownOpen && query.trim() !== "" && previewResults.length > 0}
        anchorEl={anchorEl}
        placement="bottom-start"
        sx={{ zIndex: (theme) => theme.zIndex.appBar }}
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
          <Paper elevation={4} sx={{ p: 1, maxHeight: 500, overflowY: "auto" }}>
            <Stack spacing={1}>
              {previewResults.map((item) => (
                <MediaCard key={item.id} item={item} onAdded={onAdded} />
              ))}
              <ActionButton onClick={handleShowMore} minor>
                Show More
              </ActionButton>
            </Stack>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
};
