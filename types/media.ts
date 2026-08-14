import { TmdbMovie, TmdbTvShow } from "./tmdb";

interface SavedMediaFields {
  tmdbId: number;
  format: "dvd" | "bluray" | "4K" | "3D" | "4K 3D" | "digital";
  condition: string;
  acquiredFrom: string;
  acquiredDate: string;
  pricePaid: number;
  notes: string;
  review: string;
}

export type SavedMedia =
  | (Omit<TmdbMovie, "id"> & SavedMediaFields)
  | (Omit<TmdbTvShow, "id"> & SavedMediaFields);
