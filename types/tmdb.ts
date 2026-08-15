export interface TmdbMovie {
  id: number;
  media_type: "movie";
  title: string;
  release_date: string;
  poster_path: string | null;
  overview: string;
}

export interface TmdbTvShow {
  id: number;
  media_type: "tv";
  name: string;
  first_air_date: string;
  poster_path: string | null;
  overview: string;
}

export interface TmdbPerson {
  id: number;
  media_type: "person";
  name: string;
}

export type TmdbMultiResult = TmdbMovie | TmdbTvShow | TmdbPerson;

export interface TmdbSearchResponse {
  results: TmdbMultiResult[];
  page: number;
  total_pages: number;
}

export interface TmdbExternalIds {
  imdb_id: string | null;
}
