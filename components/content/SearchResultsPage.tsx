"use client";

import { useEffect } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import { MediaCard } from "../blocks/MediaCard";
import localization from "@/locales/en";
import { useMovieSearch } from "@/hooks/useSearch";
import { ActionButton } from "../blocks/ActionButton";
import { Header } from "../blocks/Header";

interface SearchResultsPageProps {
  initialQuery: string;
}

export const SearchResultsPage = ({ initialQuery }: SearchResultsPageProps) => {
  const { query, setQuery, results, loading, hasMore, search, loadMore } =
    useMovieSearch();

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      search(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  return (
    <>
      <Header />
      <Stack spacing={2}>
        <TextField
          label={localization.search.label}
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
        />
        <Button variant="contained" onClick={() => search()} disabled={loading}>
          {loading
            ? localization.search.searchLoading
            : localization.search.buttonText}
        </Button>

        {results.map((item) => (
          <Box key={item.id}>
            <MediaCard item={item} />
          </Box>
        ))}

        {hasMore && (
          <ActionButton onClick={loadMore} disabled={loading}>
            {loading
              ? localization.search.loadMoreLoading
              : localization.search.loadMore}
          </ActionButton>
        )}
      </Stack>
    </>
  );
};
