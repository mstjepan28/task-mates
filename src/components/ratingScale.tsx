export const RatingScale = ({
  title,
  selected,
  onSelect,
  disabled,
}: {
  title: string;
  selected: string;
  onSelect: (val: string) => void;
  disabled: boolean;
}) => {
  return (
    <div className="w-fit">
      <span className="text-white text-xl font-semibold">{title}</span>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 10 }).map((_, index) => {
          const rating = (index + 1).toString();

          return (
            <RatingBox
              key={index}
              label={rating}
              selected={selected === rating}
              onClick={() => onSelect(rating)}
              disabled={disabled}
            />
          );
        })}
      </div>
    </div>
  );
};

const RatingBox = ({
  label,
  onClick,
  selected,
  disabled,
}: {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled ?? false}
      data-selected={!!selected}
      className={`
        size-12 border rounded-lg text-white p-2 bg-emerald-600/10 disabled:opacity-50
        data-[selected=true]:bg-emerald-600 data-[selected=true]:font-bold
      `}
    >
      {label}
    </button>
  );
};
