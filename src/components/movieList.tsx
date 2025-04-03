import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { GrDocumentMissing } from "react-icons/gr";
import type { TMovie } from "../schemas/movieSchema";
import { BASE_MOVIE_POSTER_WIDTH } from "../utils/constants";
import { LoadingIndicator } from "./base/loadingIndicator";
import type { TOverlayRef } from "./base/overlays/overlayElement";
import { MovieCard } from "./movieCard";
import { MovieDetailsModal } from "./popup/movieDetailsModal";

const MOVIE_CONTAINER_PADDING = 32 as const;
const MOVIE_CARD_GAP = 20 as const;

export const MovieList = ({
  movieList,
  isLoading,
  errorMsg,

  hasNextPage,
  loadingNextPage,
  onLoadMore,
}: {
  movieList: TMovie[];
  isLoading: boolean;
  errorMsg: string | undefined;

  hasNextPage: boolean;
  loadingNextPage: boolean;
  onLoadMore: () => Promise<void>;
}) => {
  const [moviePosterWidth, setMoviePosterWidth] = useState<number>(BASE_MOVIE_POSTER_WIDTH);
  const [fillerEntryCount, setFillerEntryCount] = useState(0);

  const movieDetailsModalRef = useRef(null) as TOverlayRef;
  const onMovieClick = async (movie: TMovie) => {
    movieDetailsModalRef.current?.open(movie);
  };

  const calculateMoviePosterWidth = () => {
    const containerWidth = window.innerWidth - MOVIE_CONTAINER_PADDING;

    /**
     * If the container is less than 300px, just return the container width
     */
    if (containerWidth < 400) {
      return containerWidth;
    }

    /**
     * Make sure that at least two movie posters fit in a row
     */
    const maxMoviesPerRow = Math.floor(containerWidth / (BASE_MOVIE_POSTER_WIDTH + MOVIE_CARD_GAP));

    if (maxMoviesPerRow < 2) {
      return Math.floor((containerWidth - MOVIE_CARD_GAP) / 2);
    }

    /**
     * If two or more movies fit into the container, calculate the width of
     * a single movie poster so that the max gap between the posters is 20px
     */
    const totalGapWidth = (maxMoviesPerRow - 1) * MOVIE_CARD_GAP;
    const availableWidth = containerWidth - totalGapWidth - 2;

    return Math.floor(availableWidth / maxMoviesPerRow);
  };

  const calculateFillerEntryCount = (movieWidth: number) => {
    const movieCount = movieList.length ?? 0;
    if (movieCount === 0) {
      return 0;
    }

    /**
     * Window width minus 8px padding on each side
     */
    const containerWidth = window.innerWidth - 32;
    const numberOfEntriesPerRow = Math.floor(containerWidth / movieWidth);

    const overflowEntries = movieCount % numberOfEntriesPerRow;
    return overflowEntries === 0 ? 0 : numberOfEntriesPerRow - overflowEntries;
  };

  const onMount = () => {
    const onResize = () => {
      const newMovieWidth = calculateMoviePosterWidth();
      setMoviePosterWidth(newMovieWidth);

      const newFillerEntryCount = calculateFillerEntryCount(newMovieWidth);
      setFillerEntryCount(newFillerEntryCount);
    };

    onResize();

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  };

  const onLastMovieMount = (element: HTMLDivElement | null, index: number) => {
    const isLastMovie = index === movieList.length - 1;
    if (!element || !isLastMovie || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loadingNextPage) {
        onLoadMore();
        observer.disconnect();
      }
    });

    observer.observe(element);
  };

  return (
    <>
      {createPortal(<MovieDetailsModal baseRef={movieDetailsModalRef} />, document.body)}

      <div ref={onMount} className="basis-full overflow-y-auto">
        {isLoading ? (
          <LoadingIndicator />
        ) : errorMsg ? (
          <pre>{errorMsg}</pre>
        ) : movieList.length > 0 ? (
          <div className="flex flex-wrap justify-around gap-5 p-4">
            {movieList.map((movie, index) => {
              return (
                <div key={`${movie.title}-${movie.id}`} ref={(e) => onLastMovieMount(e, index)}>
                  <MovieCard width={moviePosterWidth} movie={movie} onClick={() => onMovieClick(movie)} />
                </div>
              );
            })}

            {Array.from({ length: fillerEntryCount }).map((_, index) => {
              const key = `filler-entry-${index}`;
              return <div key={key} style={{ width: moviePosterWidth }} className="aspect-[2/3]" />;
            })}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-y-4 opacity-50">
            <GrDocumentMissing size={86} />
            <span className="text-3xl italic font-semibold">Nothing found</span>
          </div>
        )}
      </div>
    </>
  );
};
