export { debounce } from "throttle-debounce";
import { useInfiniteQuery } from "@tanstack/react-query";
import { debounce } from "throttle-debounce";
import { z } from "zod";
import { tbdbRequestPopular, tbdbRequestSearch } from "../api/tmdbRequests";
import { QueryKeys } from "../enums/queryKeys";
import { movieSchema } from "../schemas/movieSchema";
import { useFilters } from "./useFilters";

type TMovieFilters = {
  movieSearch: string;
};

export const useMovieList = () => {
  const { filters, setFilters } = useFilters<TMovieFilters>({
    initFilters: {
      movieSearch: "",
    },
  });

  const movieListQuery = useInfiniteQuery({
    queryKey: [QueryKeys.MOVIE_LIST, filters.movieSearch],
    queryFn: async ({ pageParam = 0 }) => {
      if (!filters.movieSearch) {
        const response = await tbdbRequestPopular({ page: pageParam });
        return z.promise(movieSchema).parseAsync(response.json());
      }

      const response = await tbdbRequestSearch({ query: filters.movieSearch, page: pageParam });
      return z.promise(movieSchema).parseAsync(response.json());
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage) {
        return undefined;
      }

      return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const pages = movieListQuery.data?.pages ?? [];
  const movieList = pages.flatMap((page) => {
    if (!page?.results) {
      return [];
    }

    return page.results;
  });

  return {
    search: debounce(500, (movieSearch: string) => setFilters({ movieSearch })),
    filters: filters,

    fetchMore: movieListQuery.fetchNextPage,
    hasMore: movieListQuery.hasNextPage,
    movieList: movieList,

    error: movieListQuery.error,

    fetching: {
      isLoading: movieListQuery.isLoading,
      isLoadingMore: movieListQuery.isFetchingNextPage,
    },
  };
};
