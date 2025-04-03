import { ListScreenHeader } from "../components/listScreenHeader";
import { MovieList } from "../components/movieList";
import { useReviewList } from "../hooks/useReviewList";

export const RatingsList = () => {
  const reviewList = useReviewList();

  return (
    <div className="h-full flex flex-col">
      <ListScreenHeader
        title="My Ratings"
        defaultValue={reviewList.filters.reviewSearch}
        search={(query) => reviewList.search(query)}
      />

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
