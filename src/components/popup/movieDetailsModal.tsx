import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState } from "react";
import { HiChartBar, HiOutlineTrash } from "react-icons/hi";
import { IoMdStar } from "react-icons/io";
import { IoCalendarNumber } from "react-icons/io5";
import { database } from "../../database/database";
import { DatabaseType } from "../../enums/databaseType";
import { QueryKeys } from "../../enums/queryKeys";
import type { TMovie } from "../../schemas/movieSchema";
import type { TMovieRating } from "../../types/movieRatings";
import { BASE_MOVIE_POSTER_WIDTH } from "../../utils/constants";
import { genreDataMap } from "../../utils/genreMap";
import { Button } from "../base/button";
import { DynamicHeightAccordion } from "../base/dynamicHeightAccordion";
import { BaseModal } from "../base/overlays/modal/baseModal";
import type { IOverlayElement } from "../base/overlays/overlayElement";
import { MovieCard } from "../movieCard";
import { RatingScale } from "../ratingScale";

const CATEGORIES = ["Visuals", "Plot", "Ending", "Acting", "Enjoyment"] as const;

export const MovieDetailsModal = ({ baseRef }: IOverlayElement) => {
  const [selectedMovie, setSelectedMovie] = useState<TMovie | null>(null);
  const [alreadyRated, setAlreadyRated] = useState(false);

  const [ratings, setRatings] = useState<Record<string, string> | null>(null);
  const [ratingsEnabled, setRatingsEnabled] = useState(false);

  const queryClient = useQueryClient();

  const closeModal = () => baseRef.current?.close();

  const onModalOpen = async (newMovie: unknown) => {
    if (!newMovie) {
      console.error("No movie was passed to the modal");
      return;
    }

    console.log(newMovie);

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

  const setRating = (category: string, rating: string) => {
    if (rating !== ratings?.[category]) {
      setRatings((prev) => ({ ...prev, [category]: rating }));
      return;
    }

    setRatings((prev) => {
      const newRatings = { ...prev };
      delete newRatings[category];

      return newRatings;
    });
  };

  const onSave = () => {
    if (!selectedMovie) {
      return;
    }

    database.upsertItem(DatabaseType.MOVIE_RATING, {
      id: selectedMovie?.id,
      ratings: ratings,
      movieData: selectedMovie,
    });

    closeModal();
  };

  const deleteRating = () => {
    if (!selectedMovie) {
      return;
    }

    queryClient.refetchQueries({
      queryKey: [QueryKeys.MOVIE_RATING_LIST],
    });
    database.deleteItem(selectedMovie.id);

    closeModal();
  };

  const ratedCategories = Object.keys(ratings ?? {}).length;
  const disableSave = ratedCategories !== CATEGORIES.length;

  if (!selectedMovie) {
    return <BaseModal ref={baseRef} onOpen={onModalOpen} forceState="popup" closeOnOutsideClick />;
  }

  return (
    <BaseModal ref={baseRef} onOpen={onModalOpen} onClose={onModalClose} forceState="popup" closeOnOutsideClick>
      <div className="overflow-y-auto px-4 pt-6">
        <div className="flex gap-x-4">
          <div className="pointer-events-none">
            <MovieCard width={BASE_MOVIE_POSTER_WIDTH} movie={selectedMovie} onClick={() => {}} />
          </div>

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

        <div className="text-white py-4">
          <p className="font-sm">{selectedMovie.overview}</p>
        </div>

        <DynamicHeightAccordion isOpen={(false && alreadyRated) || ratingsEnabled}>
          <div className="grid sm:grid-cols- gap-4 pt-4">
            {CATEGORIES.map((category) => {
              return (
                <RatingScale
                  key={category}
                  title={category}
                  selected={ratings?.[category] ?? ""}
                  onSelect={(rating) => setRating(category, rating)}
                  disabled={alreadyRated}
                />
              );
            })}
          </div>
        </DynamicHeightAccordion>
      </div>

      <div className="px-2 py-4">
        {alreadyRated ? (
          <Button onClick={deleteRating} className="bg-red-700">
            <div className="flex justify-center items-center gap-x-2">
              <HiOutlineTrash />
              Delete rating
            </div>
          </Button>
        ) : ratingsEnabled ? (
          <Button onClick={onSave} disabled={disableSave}>
            Save ratings ({ratedCategories}/{CATEGORIES.length})
          </Button>
        ) : (
          <Button onClick={() => setRatingsEnabled(true)}>Rate movie</Button>
        )}
      </div>
    </BaseModal>
  );
};
