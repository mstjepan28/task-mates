import { twMerge } from "tailwind-merge";
import { LoadingIndicator } from "./loadingIndicator";

export const LoadMoreButton = ({
  loadingNextPage,
  hasNextPage,
  onLoadMore,
  className,
}: {
  hasNextPage: boolean;
  loadingNextPage: boolean;
  onLoadMore: () => void;
  className?: string;
}) => {
  if (loadingNextPage) {
    return (
      <div className={twMerge("p-5", className)}>
        <LoadingIndicator size="md" />
      </div>
    );
  }

  if (hasNextPage && !loadingNextPage) {
    return (
      <div className={twMerge("p-5", className)}>
        <button type="button" onClick={onLoadMore} className="w-full text-center font-semibold text-primary-600">
          Load more
        </button>
      </div>
    );
  }
};
