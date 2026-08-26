import { NextRequest } from "next/server";
import { getExternalIds } from "@/lib/tmdb";
import { isRateLimited } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return Response.json({ imdb_id: null }, { status: 429 });
  }

  const mediaType = req.nextUrl.searchParams.get("mediaType") as
    "movie" | "tv" | null;
  const id = req.nextUrl.searchParams.get("id");
  if (!mediaType || !id) return Response.json({ imdb_id: null });

  try {
    const data = await getExternalIds(mediaType, Number(id));
    return Response.json(data);
  } catch (err) {
    console.error(err);
    return Response.json({ imdb_id: null }, { status: 502 });
  }
}
