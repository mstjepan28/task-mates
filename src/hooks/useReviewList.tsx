import { useInfiniteQuery } from "@tanstack/react-query";
import { debounce } from "throttle-debounce";
import { database } from "../database/database";
import { DatabaseType } from "../enums/databaseType";
import { QueryKeys } from "../enums/queryKeys";
import type { TMovieRating } from "../types/movieRatings";
import { useFilters } from "./useFilters";

type TReviewFilters = {
  reviewSearch: string;
};

export const useReviewList = () => {
  const { filters, setFilters } = useFilters<TReviewFilters>({
    initFilters: {
      reviewSearch: "",
    },
  });

  const reviewListQuery = useInfiniteQuery({
    queryKey: [QueryKeys.MOVIE_RATING_LIST, filters.reviewSearch],
    queryFn: async ({ pageParam = 0 }) => {
      return database.queryDatabase<TMovieRating>({
        type: DatabaseType.MOVIE_RATING,
        page: pageParam,
        pageSize: 15,
        queryFn: ({ movieData }) => {
          if (!filters.reviewSearch) {
            return true;
          }

          const lowercaseSearch = filters.reviewSearch.toLowerCase();
          const { title, overview } = movieData;

          return title.toLowerCase().includes(lowercaseSearch) || overview.toLowerCase().includes(lowercaseSearch);
        },
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.lastPage > allPages.length ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 0,
    gcTime: 0,
  });

  const movieList = reviewListQuery.data?.pages.flatMap((page) => {
    return page.results.map((res) => res.movieData);
  });

  return {
    search: debounce(500, (reviewSearch: string) => setFilters({ reviewSearch })),
    filters: filters,

    fetchMore: async () => {
      reviewListQuery.fetchNextPage();
    },
    hasMore: reviewListQuery.hasNextPage,
    movieList: movieList,

    error: reviewListQuery.error,

    fetching: {
      isLoading: reviewListQuery.isFetching,
      isLoadingMore: reviewListQuery.isFetchingNextPage,
    },
  };
};
