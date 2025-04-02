import type { TMovie } from "../schemas/movieSchema";
import { getRandomListElement } from "../utils/listHelpers";

export const MovieCard = ({
  width,
  movie,
  onClick,
}: {
  width: number;
  movie: TMovie;
  onClick: () => void;
}) => {
  const getRandomBgGradient = () => {
    const gradientDirection = [
      "bg-gradient-to-b",
      "bg-radial-[at_25%_0%]",
      "bg-radial-[at_25%_50%]",
      "bg-radial-[at_25%_75%]",
      "bg-radial-[at_25%_100%]",
      "bg-radial-[at_50%_0%]",
      "bg-radial-[at_50%_75%]",
      "bg-radial-[at_50%_100%]",
      "bg-radial-[at_75%_0%]",
      "bg-radial-[at_75%_25%]",
      "bg-radial-[at_75%_50%]",
      "bg-radial-[at_75%_100%]",
    ];

    const gradientColors = [
      "from-amber-500 to-pink-500",
      "from-teal-400 to-yellow-200",
      "from-emerald-400 to-cyan-400",
      "from-red-500 to-orange-500",
      "from-fuchsia-500 to-cyan-500",
      "from-blue-800 to-indigo-900",
      "from-purple-500 to-purple-900",
      "from-emerald-500 to-emerald-900",
    ];

    const direction = getRandomListElement(gradientDirection);
    const colors = getRandomListElement(gradientColors);

    return `${direction} ${colors}`;
  };

  const hasPoster = movie.poster_path !== null;

  const backgroundImage = hasPoster ? `url('${movie.poster_path}')` : undefined;
  const bgGradient = hasPoster ? "" : getRandomBgGradient();

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ width }}
      className="aspect-[2/3] overflow-hidden hover:backdrop-blur-3xl text-white"
    >
      <div
        style={{ backgroundImage }}
        className={`
          group size-full bg-contain bg-no-repeat transition-transform 
          duration-300 hover:scale-125 ${bgGradient} 
        `}
      >
        <div className="size-full flex items-center justify-center duration-300 group-hover:backdrop-brightness-50 group-hover:backdrop-blur-lg">
          {!hasPoster ? (
            <>
              <span className="w-[75%] font-bold text-center text-sm">{movie.title}</span>
            </>
          ) : (
            <div className="w-[75%] blur-3xl group-hover:blur-none duration-300 font-bold text-center text-sm">
              {movie.title}
            </div>
          )}
        </div>
      </div>
    </button>
  );
};
