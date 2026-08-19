import { SortOption } from "@/types/sort";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
  { value: "acquiredDate-asc", label: "Purchase Date (Oldest first)" },
  { value: "acquiredDate-desc", label: "Purchase Date (Newest first)" },
  { value: "price-asc", label: "Price Paid (Low – High)" },
  { value: "price-desc", label: "Price Paid (High – Low)" },
];
