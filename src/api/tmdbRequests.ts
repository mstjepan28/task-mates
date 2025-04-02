import { env } from "../utils/env";

export const tbdbRequestSearch = async (filterParams: {
  include_adult?: boolean;
  language?: string;
  query?: string;
  page?: number;
}) => {
  const encodedFilters = new URLSearchParams({
    include_adult: (filterParams.include_adult ?? false)?.toString(),
    language: filterParams.language ?? "en-US",

    page: (filterParams.page ?? 1).toString(),
    query: filterParams.query ?? "",
    sort_by: "vote_average.desc",
  }).toString();

  const headers = getTmdbHeaders();
  return fetch(`${env.tmdbEndpoint}/search/movie?${encodedFilters}`, headers);
};

export const tbdbRequestPopular = async (filterParams: {
  include_adult?: boolean;
  language?: string;
  page?: number;
}) => {
  const encodedFilters = new URLSearchParams({
    include_adult: (filterParams.include_adult ?? false)?.toString(),
    language: filterParams.language ?? "en-US",
    page: (filterParams.page ?? 1).toString(),
  }).toString();

  const headers = getTmdbHeaders();
  return fetch(`https://api.themoviedb.org/3/movie/popular?${encodedFilters}`, headers);
};

const getTmdbHeaders = (): RequestInit => {
  return {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${env.tmdbBearer}`,
    },
  };
};
