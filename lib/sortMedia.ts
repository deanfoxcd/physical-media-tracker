import type { SavedMedia } from "@/types/media";
import { SortOption } from "@/types/sort";

const LEADING_ARTICLE = /^(the)\s+/i;

function getName(item: SavedMedia) {
  return (item.media_type === "movie" ? item.title : item.name) ?? "";
}

function getSortName(item: SavedMedia) {
  return getName(item).replace(LEADING_ARTICLE, "");
}

function compareStrings(a?: string, b?: string) {
  return (a ?? "").localeCompare(b ?? "");
}

function comparePrices(a?: number, b?: number) {
  return (a ?? 0) - (b ?? 0);
}

export function sortSavedMedia<T extends SavedMedia & { id: string }>(
  items: T[],
  sortOption: SortOption,
): T[] {
  const sorted = [...items];

  switch (sortOption) {
    case "name-asc":
      return sorted.sort((a, b) =>
        compareStrings(getSortName(a), getSortName(b)),
      );
    case "name-desc":
      return sorted.sort((a, b) =>
        compareStrings(getSortName(b), getSortName(a)),
      );
    case "acquiredDate-asc":
      return sorted.sort((a, b) =>
        compareStrings(a.acquiredDate, b.acquiredDate),
      );
    case "acquiredDate-desc":
      return sorted.sort((a, b) =>
        compareStrings(b.acquiredDate, a.acquiredDate),
      );
    case "price-asc":
      return sorted.sort((a, b) => comparePrices(a.pricePaid, b.pricePaid));
    case "price-desc":
      return sorted.sort((a, b) => comparePrices(b.pricePaid, a.pricePaid));
    default:
      return sorted;
  }
}
