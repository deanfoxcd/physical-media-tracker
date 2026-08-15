import { TmdbExternalIds } from "@/types/tmdb";

const TMDB_BASE = "https://api.themoviedb.org/3";

export async function searchMovies(query: string, page: number = 1) {
  const res = await fetch(
    `${TMDB_BASE}/search/multi?query=${encodeURIComponent(query)}&page=${page}`,
    { headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` } },
  );
  if (!res.ok) throw new Error(`TMDB search failed: ${res.status}`);
  return res.json();
}

export async function getExternalIds(
  mediaType: "movie" | "tv",
  id: number,
): Promise<TmdbExternalIds> {
  const res = await fetch(`${TMDB_BASE}/${mediaType}/${id}/external_ids`, {
    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
  });
  if (!res.ok) throw new Error(`TMDB external_ids failed: ${res.status}`);
  return res.json();
}
