import { TmdbMovie, TmdbTvShow } from "./tmdb";

export type SavedMedia = Omit<TmdbMovie | TmdbTvShow, "id"> & {
  tmdbId: number;
  format: "dvd" | "bluray" | "4K" | "3D" | "4K 3D" | "digital";
  condition: string;
  acquiredFrom: string;
  acquiredDate: string;
  pricePaid: number;
  notes: string;
  review: string;
};
