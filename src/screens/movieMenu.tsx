import { useState } from "react";
import { Link } from "react-router";
import { SearchBar } from "../components/base/searchbar";

export const MovieMenu = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="h-full flex flex-col justify-center items-center p-4">
      <h1 className="text-5xl italic text-center py-4">𝓜𝓸𝓿𝓲𝓮𝓼</h1>

      <SearchBar
        id="movie-search"
        defaultValue={search}
        placeholder={"Search for a movie..."}
        onChange={(val) => setSearch(val)}
      />

      {/* h-20 so the searchbar is centered on the screen */}
      <div className="h-20 pt-3 flex items-start gap-x-2">
        <Link
          to={`/movies/explore?movieSearch=${search}`}
          className="px-4 py-1 border rounded-lg font-medium bg-gray-800"
        >
          Search
        </Link>

        <Link to={"/movies/ratings"} className="px-4 py-1 border rounded-lg font-medium bg-gray-800">
          My Ratings
        </Link>
      </div>
    </div>
  );
};
