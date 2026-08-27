import { SearchResultsPage } from "@/components/content/SearchResultsPage/SearchResultsPage";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return <SearchResultsPage initialQuery={q ?? ""} />;
}
