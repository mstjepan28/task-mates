import { HiChevronLeft } from "react-icons/hi";
import { SearchBar } from "./base/searchbar";

export const ListScreenHeader = ({
  title,
  defaultValue,
  search,
}: {
  title: string;
  defaultValue: string;
  search: (value: string) => void;
}) => {
  return (
    <div className="px-4 pt-4 grid gap-y-4">
      <div className="flex items-center gap-x-2">
        <button type="button" className="px-1" onClick={() => window.history.back()}>
          <HiChevronLeft size={24} className="text-white" />
        </button>

        <span className="uppercase font-bold">{title}</span>
      </div>

      <SearchBar
        id="movie-search"
        defaultValue={defaultValue}
        placeholder={"Search for a movie..."}
        onChange={search}
      />
    </div>
  );
};
