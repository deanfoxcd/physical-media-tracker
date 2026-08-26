"use client";

import { useEffect } from "react";
import { Box, Button, CircularProgress, Stack, TextField } from "@mui/material";
import { MediaCard } from "../blocks/MediaCard";
import localization from "@/locales/en";
import { useMovieSearch } from "@/hooks/useSearch";
import { ActionButton } from "../blocks/ActionButton";
import { Header } from "../blocks/Header";
import { useAuth } from "@/contexts/AuthContext";
import { LoginPage } from "./LoginPage";

interface SearchResultsPageProps {
  initialQuery: string;
}

export const SearchResultsPage = ({ initialQuery }: SearchResultsPageProps) => {
  const { user, loading: authLoading } = useAuth();
  const { query, setQuery, results, loading, hasMore, search, loadMore } =
    useMovieSearch();

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      search(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  if (authLoading) {
    return (
      <Stack sx={{ alignItems: "center", mt: 10 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

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
