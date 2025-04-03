import { HiSearch } from "react-icons/hi";

export const SearchBar = ({
  id,
  defaultValue,
  placeholder,
  onChange,
}: {
  id?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (val: string) => void;
}) => {
  return (
    <div
      id={id}
      style={{ viewTransitionName: id }}
      className="w-full flex items-center gap-x-2 px-5 py-2 rounded-full border text-gray-100 bg-gray-800"
    >
      <HiSearch size={20} />
      <input
        type="text"
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={(e) => {
          if (typeof onChange === "function") {
            onChange(e.target.value);
          }
        }}
        className="w-full outline-none text-lg"
      />
    </div>
  );
};
