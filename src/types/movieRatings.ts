import type { TMovie } from "../schemas/movieSchema";

export type TMovieRating = {
  id: string;
  ratings: Record<string, string>;
  movieData: TMovie;
};
