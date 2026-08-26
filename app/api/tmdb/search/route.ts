import { NextRequest } from "next/server";
import { searchMovies } from "@/lib/tmdb";
import { isRateLimited } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return Response.json(
      { results: [], page: 1, total_pages: 0, error: "Too many requests" },
      { status: 429 },
    );
  }

  const query = req.nextUrl.searchParams.get("q") ?? "";
  const page = Number(req.nextUrl.searchParams.get("page") ?? "1");
  if (!query.trim())
    return Response.json({ results: [], page: 1, total_pages: 0 });

  try {
    const data = await searchMovies(query, page);
    return Response.json(data);
  } catch (err) {
    console.error(err);
    return Response.json(
      { results: [], page: 1, total_pages: 0, error: "TMDB search failed" },
      { status: 502 },
    );
  }
}
