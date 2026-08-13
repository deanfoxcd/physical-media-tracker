"use client";

import { Box, Button, Stack, TextField } from "@mui/material";
import { MediaCard } from "./MediaCard";
import { ButtonSolid } from "./ButtonSolid";
import localization from "@/locales/en";
import { useMovieSearch } from "@/hooks/useSearch";

export const Search = () => {
  const { query, setQuery, results, loading, hasMore, search, loadMore } =
    useMovieSearch();

  return (
    <Stack spacing={2}>
      <TextField
        label={localization.search.label}
        variant="outlined"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && search()}
      />
      <Button variant="contained" onClick={search} disabled={loading}>
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
        <ButtonSolid onClick={loadMore} disabled={loading}>
          {loading
            ? localization.search.loadMoreLoading
            : localization.search.loadMore}
        </ButtonSolid>
      )}
    </Stack>
  );
};
