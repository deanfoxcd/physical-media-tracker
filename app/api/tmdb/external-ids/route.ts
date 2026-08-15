import { NextRequest } from "next/server";
import { getExternalIds } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const mediaType = req.nextUrl.searchParams.get("mediaType") as
    "movie" | "tv" | null;
  const id = req.nextUrl.searchParams.get("id");
  if (!mediaType || !id) return Response.json({ imdb_id: null });

  const data = await getExternalIds(mediaType, Number(id));
  return Response.json(data);
}
