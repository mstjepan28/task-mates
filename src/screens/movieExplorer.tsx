import { MovieList } from "../components/movieList";
import { useMovieList } from "../hooks/useMovieList";

export const MovieExplorer = () => {
  const movieList = useMovieList();

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 pt-4">
        <input
          type="text"
          placeholder="Search for a movie..."
          defaultValue={movieList.filters.movieSearch}
          onChange={(event) => movieList.search(event.target.value)}
          className="w-full !outline-0 !ring-0 rounded-lg px-2 py-1 text-gray-950 bg-gray-100"
        />
      </div>

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
