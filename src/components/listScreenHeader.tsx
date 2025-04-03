import { HiChevronLeft } from "react-icons/hi";

export const ListScreenHeader = ({
  defaultValue,
  search,
}: {
  defaultValue: string;
  search: (value: string) => void;
}) => {
  return (
    <div className="flex items-center gap-x-2 px-4 pt-4">
      <button type="button" className="h-full border px-1 rounded-lg bg-white" onClick={() => window.history.back()}>
        <HiChevronLeft size={24} fill="bg-gray-900" />
      </button>

      <input
        type="text"
        placeholder="Search for a movie..."
        defaultValue={defaultValue}
        onChange={(e) => search(e.target.value)}
        className="w-full !outline-0 !ring-0 rounded-lg px-2 py-1 text-gray-950 bg-gray-100"
      />
    </div>
  );
};
