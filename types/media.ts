import { TmdbMovie, TmdbTvShow } from "./tmdb";

export interface SavedMediaFields {
  tmdbId: number;
  imdbId: string | null;
  userId: string;
  status: "owned" | "wishlist";
  format: "DVD" | "Blu-Ray" | "4K" | "3D" | "4K 3D";
  condition?: string;
  acquiredFrom?: string;
  acquiredDate?: string;
  pricePaid?: number;
  notes?: string;
  review?: string;
  rating?: string;
}

type DistributivePartial<T> = T extends unknown ? Partial<T> : never;

export type SavedMediaUpdates = DistributivePartial<SavedMedia>;

export type SavedMedia =
  | (Omit<TmdbMovie, "id"> & SavedMediaFields)
  | (Omit<TmdbTvShow, "id"> & SavedMediaFields);
