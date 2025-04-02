import { z } from "zod";
import { env } from "../utils/env";
import { MovieGenre } from "../utils/genreMap";

export const movieResultSchema = z.object({
  id: z.number().transform((val) => val.toString()),
  adult: z.boolean(),
  backdrop_path: z.string().nullable(),
  genre_ids: z.array(z.nativeEnum(MovieGenre)),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z
    .string()
    .nullable()
    .transform((val) => (val ? `${env.tmdbImgEndpoint}/${val}` : null)),
  release_date: z.string(),
  title: z.string(),
  video: z.boolean(),
  vote_average: z.number(),
  vote_count: z.number(),
});

export const movieSchema = z.object({
  page: z.number(),
  results: z.array(movieResultSchema),
  total_pages: z.number(),
  total_results: z.number(),
});

export type TMovie = z.infer<typeof movieResultSchema>;
