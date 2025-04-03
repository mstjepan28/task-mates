import { ListScreenHeader } from "../components/listScreenHeader";
import { MovieList } from "../components/movieList";
import { useMovieList } from "../hooks/useMovieList";

export const MovieExplorer = () => {
  const movieList = useMovieList();

  return (
    <div className="h-full flex flex-col">
      <ListScreenHeader defaultValue={movieList.filters.movieSearch} search={(query) => movieList.search(query)} />

      <MovieList
        movieList={movieList.movieList}
        isLoading={movieList.fetching.isLoading}
        errorMsg={movieList.error?.message}
        loadingNextPage={movieList.fetching.isLoadingMore}
        hasNextPage={movieList.hasMore}
        onLoadMore={movieList.fetchMore}
      />
    </div>
  );
};
