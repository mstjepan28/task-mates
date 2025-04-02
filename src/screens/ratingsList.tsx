import { MovieList } from "../components/movieList";
import { useReviewList } from "../hooks/useReviewList";

export const RatingsList = () => {
  const reviewList = useReviewList();

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 pt-4">
        <input
          type="text"
          placeholder="Search for a movie..."
          defaultValue={reviewList.filters.reviewSearch}
          onChange={(event) => reviewList.search(event.target.value)}
          className="w-full !outline-0 !ring-0 rounded-lg px-2 py-1 text-gray-950 bg-gray-100"
        />
      </div>

      <MovieList
        movieList={reviewList.movieList ?? []}
        isLoading={reviewList.fetching.isLoading}
        errorMsg={reviewList.error?.message}
        loadingNextPage={reviewList.fetching.isLoadingMore}
        hasNextPage={reviewList.hasMore}
        onLoadMore={reviewList.fetchMore}
      />
    </div>
  );
};
