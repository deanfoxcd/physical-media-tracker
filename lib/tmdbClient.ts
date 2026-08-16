export async function fetchImdbId(
  mediaType: "movie" | "tv",
  tmdbId: number,
): Promise<string | null> {
  const res = await fetch(
    `/api/tmdb/external-ids?mediaType=${mediaType}&id=${tmdbId}`,
  );
  const data = await res.json();
  return data.imdb_id ?? null;
}
