"use client";

import { useState } from "react";
import { Button, Stack, TextField, Typography } from "@mui/material";
import type { TmdbMultiResult } from "@/types/tmdb";
import Image from "next/image";

const POSTER_BASE = "https://image.tmdb.org/t/p/w154";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TmdbMultiResult[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  async function runSearch(nextPage: number, append: boolean) {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/tmdb/search?q=${encodeURIComponent(query)}&page=${nextPage}`,
      );
      const data = await res.json();
      setResults((prev) => {
        const filtered = data.results.filter(
          (r: TmdbMultiResult) =>
            r.media_type === "movie" || r.media_type === "tv",
        );
        return append ? [...prev, ...filtered] : filtered;
      });
      setPage(data.page);
      setTotalPages(data.total_pages);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    runSearch(1, false);
  }

  function handleLoadMore() {
    runSearch(page + 1, true);
  }

  return (
    <Stack spacing={2}>
      <TextField
        label="Search"
        variant="outlined"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <Button variant="contained" onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search for Movie"}
      </Button>

      {results.map((item) =>
        item.media_type === "person" ? null : (
          <Stack key={item.id} direction="row" spacing={2}>
            {item.poster_path && (
              <Image
                src={`${POSTER_BASE}${item.poster_path}`}
                alt={item.media_type === "movie" ? item.title : item.name}
                width={92}
                height={138}
              />
            )}
            <Button key={item.id} onClick={() => console.log(item)}>
              <Typography>
                {item.media_type === "movie" ? item.title : item.name} (
                {(item.media_type === "movie"
                  ? item.release_date
                  : item.first_air_date
                )?.slice(0, 4)}
                )
              </Typography>
            </Button>
          </Stack>
        ),
      )}

      {results.length > 0 && page < totalPages && (
        <Button variant="outlined" onClick={handleLoadMore} disabled={loading}>
          {loading ? "Loading..." : "Load more"}
        </Button>
      )}
    </Stack>
  );
}
