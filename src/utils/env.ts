import { z } from "zod";

export const env = z
  .object({
    tmdbImgEndpoint: z.string(),
    tmdbEndpoint: z.string(),
    tmdbBearer: z.string(),
    tmdbApiKey: z.string(),
  })
  .parse({
    tmdbImgEndpoint: import.meta.env.VITE_TMDB_IMG_ENDPOINT,
    tmdbEndpoint: import.meta.env.VITE_TMDB_ENDPOINT,
    tmdbBearer: import.meta.env.VITE_TMDB_BEARER_TOKEN,
    tmdbApiKey: import.meta.env.VITE_TMDB_API,
  });
