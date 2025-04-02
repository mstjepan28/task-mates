import { twMerge } from "tailwind-merge";
import type { IModalBodyProps } from "./modalProps";

export const ModalFloatingBody = ({
  close,
  isOpen,
  classNameBody,
  classNameBackdrop,
  children,
  closeOnOutsideClick,
  disableClosing,
  onOutsideClick,
}: IModalBodyProps) => {
  const onBackdropClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();

    if (closeOnOutsideClick && !disableClosing) {
      close();
    }

    if (typeof onOutsideClick === "function") {
      onOutsideClick();
    }
  };

  const customStyles = `${isOpen ? "flex" : "hidden"} ${closeOnOutsideClick ? "cursor-pointer" : ""}`;

  return (
    <div
      data-open={!!isOpen}
      data-clickable={closeOnOutsideClick}
      onClick={onBackdropClick}
      className={twMerge(
        `fixed inset-0 items-center justify-center z-50 bg-black/40 ${customStyles}`,
        classNameBackdrop,
      )}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={twMerge("mx-4 w-full max-w-xs cursor-auto rounded-lg bg-white p-4 md:mx-0", classNameBody)}
      >
        {children}
      </div>
    </div>
  );
};
