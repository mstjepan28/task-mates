import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { HiChartBar } from "react-icons/hi";
import { IoMdStar } from "react-icons/io";
import { IoCalendarNumber } from "react-icons/io5";
import { database } from "../../database/database";
import { DatabaseType } from "../../enums/databaseType";
import type { TMovie } from "../../schemas/movieSchema";
import type { TMovieRating } from "../../types/movieRatings";
import { BASE_MOVIE_POSTER_WIDTH } from "../../utils/constants";
import { genreDataMap } from "../../utils/genreMap";
import { Button } from "../base/button";
import { DynamicHeightAccordion } from "../base/dynamicHeightAccordion";
import { BaseModal } from "../base/overlays/modal/baseModal";
import type { IOverlayElement } from "../base/overlays/overlayElement";
import { MovieCard } from "../movieCard";

type TRatingCategories = Record<string, string>;
const CATEGORIES = ["Visuals", "Plot", "Ending", "Acting", "Enjoyment"] as const;

export const MovieDetailsModal = ({ baseRef }: IOverlayElement) => {
  const [selectedMovie, setSelectedMovie] = useState<TMovie | null>(null);
  const [alreadyRated, setAlreadyRated] = useState(false);

  const [ratings, setRatings] = useState<TRatingCategories | null>(null);
  const [ratingsEnabled, setRatingsEnabled] = useState(false);

  const onModalOpen = async (newMovie: unknown) => {
    if (!newMovie) {
      console.error("No movie was passed to the modal");
      return;
    }

    const typedMovie = newMovie as TMovie;
    setSelectedMovie(typedMovie);

    const movieRatings = await database.queryItemById<TMovieRating>(typedMovie.id);
    setRatings(movieRatings?.ratings ?? null);

    setAlreadyRated(!!movieRatings);
  };

  const onModalClose = () => {
    setSelectedMovie(null);
    setRatingsEnabled(false);
    setRatings(null);
    setAlreadyRated(false);
  };

  const onRatingsSave = (ratings: TRatingCategories) => {
    if (!selectedMovie) {
      return;
    }

    database.upsertItem(DatabaseType.MOVIE_RATING, {
      id: selectedMovie?.id,
      ratings: ratings,
      movieData: selectedMovie,
    });

    setRatingsEnabled(false);
    setAlreadyRated(true);
    setRatings(ratings);
  };

  const averages = getAverageRatingScore(ratings ?? {}, CATEGORIES.length);

  if (!selectedMovie) {
    return <BaseModal ref={baseRef} onOpen={onModalOpen} forceState="popup" closeOnOutsideClick />;
  }

  return (
    <BaseModal ref={baseRef} onOpen={onModalOpen} onClose={onModalClose} forceState="popup" closeOnOutsideClick>
      <div className="overflow-y-auto px-4 pt-6">
        <div className="flex gap-x-4">
          {/* Movie poster */}
          <div className="pointer-events-none">
            <MovieCard width={BASE_MOVIE_POSTER_WIDTH} movie={selectedMovie} onClick={() => {}} />
          </div>

          {/* Movie details */}
          <div className="basis-full flex flex-col gap-y-2 text-white">
            <span className="font-bold text-2xl">{selectedMovie.title}</span>

            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <span className="flex items-center gap-x-2 text-white/70">
                <IoCalendarNumber />
                {dayjs(selectedMovie.release_date).format("DD MMMM YYYY")}
              </span>

              <span className="flex items-center gap-x-2 text-white/70">
                <IoMdStar />
                {selectedMovie.vote_average.toFixed(2)}
              </span>

              <span className="flex items-center gap-x-2 text-white/70">
                <HiChartBar />
                {selectedMovie.popularity}
              </span>
            </div>

            <div className="flex flex-wrap gap-1 py-2">
              {selectedMovie.genre_ids.map((id) => {
                return (
                  <span key={id} className="text-xs bg-gray-800/90 text-white px-3 py-1 rounded-lg">
                    {genreDataMap[id].label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="text-white py-4">
          <p className="font-sm">{selectedMovie.overview}</p>
        </div>

        <DynamicHeightAccordion isOpen={!!ratings && !ratingsEnabled}>
          <div className="flex flex-wrap gap-x-2 gap-y-3">
            {CATEGORIES.map((category) => {
              const rating = (ratings ?? {})[category];

              return (
                <span
                  key={category}
                  className="border px-2.5 py-1 text-xs rounded-full transition-all whitespace-nowrap text-white border-white bg-emerald-600 font-medium"
                >
                  {category}: {rating}
                </span>
              );
            })}

            <span className="border px-2.5 py-1 text-xs rounded-full transition-all whitespace-nowrap bg-emerald-600 text-white font-medium">
              Avg score: {averages.avgRating}
            </span>
          </div>
        </DynamicHeightAccordion>

        <DynamicHeightAccordion isOpen={ratingsEnabled}>
          <RateMovieCarousel originalRatings={ratings} onFinish={onRatingsSave} />
        </DynamicHeightAccordion>
      </div>

      <DynamicHeightAccordion isOpen={!ratingsEnabled}>
        <div className="px-2 py-4">
          <Button onClick={() => setRatingsEnabled(true)}>{alreadyRated ? "Edit ratings" : "Rate this movie"}</Button>
        </div>
      </DynamicHeightAccordion>
    </BaseModal>
  );
};

const RateMovieCarousel = ({
  originalRatings,
  onFinish,
}: {
  originalRatings: TRatingCategories | null;
  onFinish: (ratingsData: TRatingCategories) => void;
}) => {
  const [ratings, setRatings] = useState<TRatingCategories>(originalRatings ?? {});
  const [curStep, setCurStep] = useState(0);

  const curOffset = 100 * curStep;
  const { avgRating, allRatingsFilled } = getAverageRatingScore(ratings, CATEGORIES.length);

  const onRatingClick = (category: string, rating: string) => {
    setRatings((prev) => {
      return { ...prev, [category]: rating };
    });

    /** Finds a unfinished step after the current step */
    for (let i = curStep + 1; i < CATEGORIES.length; i++) {
      if (!ratings[CATEGORIES[i]]) {
        setCurStep(i);
        return;
      }
    }

    /** Finds a unfinished step before the current step */
    for (let i = curStep - 1; i >= 0; i--) {
      if (!ratings[CATEGORIES[i]]) {
        setCurStep(i);
        return;
      }
    }
  };

  useEffect(() => {
    if (!originalRatings) {
      return;
    }

    setRatings(originalRatings);
  }, [originalRatings]);

  return (
    <div className="grid gap-y-4 pb-6">
      {/* Score display */}
      <div className="flex flex-wrap gap-x-2 gap-y-3">
        {CATEGORIES.map((category, index) => {
          const isCurCategory = CATEGORIES[curStep] === category;
          const rating = ratings[category];

          return (
            <button
              key={category}
              type="button"
              onClick={() => setCurStep(index)}
              className={`
                border px-2.5 py-1 text-xs rounded-full transition-all whitespace-nowrap
                ${isCurCategory ? "text-white border-white" : "text-gray-500 border-gray-500 opacity-50"}
                ${rating ? "bg-emerald-600 text-white font-medium" : ""}
              `}
            >
              {category}: {rating ?? "-"}
            </button>
          );
        })}

        <span
          className={`
            border px-2.5 py-1 text-xs rounded-full transition-all whitespace-nowrap opacity-50
            ${allRatingsFilled ? "bg-emerald-600 text-white font-medium" : "text-gray-500 border-gray-500"}
          `}
        >
          Avg score: {avgRating}
        </span>
      </div>

      {/* Rating picker container */}
      <div style={{ translate: `-${curOffset}% 0` }} className="flex translate-all duration-500">
        {CATEGORIES.map((category) => {
          return (
            <div key={category} className="shrink-0 basis-full w-full grid grid-cols-5 grid-rows-2 gap-x-2 gap-y-3 ">
              {Array.from({ length: 10 }).map((_, index) => {
                const rating = (index + 1).toString();
                const isSelected = ratings[category] === rating;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => onRatingClick(category, rating)}
                    className={`
                        border-2 rounded-lg text-white transition-all py-2
                        text-lg font-medium ${isSelected ? "bg-emerald-600" : ""}
                      `}
                  >
                    {rating}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className={`border rounded-lg py-2 font-lg font-semibold text-white bg-emerald-600 disabled:opacity-50 disabled:pointer-events-none`}
        onClick={() => onFinish(ratings)}
        disabled={!allRatingsFilled}
      >
        {allRatingsFilled ? "Save ratings" : "Ratings not finished"}
      </button>
    </div>
  );
};

const getAverageRatingScore = (ratings: TRatingCategories, categoriesCount: number) => {
  const ratingValues = Object.values(ratings);
  const allRatingsFilled = ratingValues.length === categoriesCount;

  const sumRating = allRatingsFilled ? ratingValues.reduce<number>((s, c) => s + Number(c), 0) : 0;
  const avgRating = allRatingsFilled ? (sumRating / categoriesCount).toFixed(2) : "-";

  return {
    avgRating,
    allRatingsFilled,
  };
};
