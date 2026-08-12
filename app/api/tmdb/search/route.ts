import { NextRequest } from "next/server";
import { searchMovies } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q") ?? "";
  const page = Number(req.nextUrl.searchParams.get("page") ?? "1");
  if (!query.trim())
    return Response.json({ results: [], page: 1, total_pages: 0 });

  const data = await searchMovies(query, page);
  return Response.json(data);
}
