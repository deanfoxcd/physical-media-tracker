import { useState } from "react";
import type { TmdbMultiResult } from "@/types/tmdb";

export function useMovieSearch() {
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

  function search() {
    runSearch(1, false);
  }

  function loadMore() {
    runSearch(page + 1, true);
  }

  return {
    query,
    setQuery,
    results,
    loading,
    hasMore: results.length > 0 && page < totalPages,
    search,
    loadMore,
  };
}
