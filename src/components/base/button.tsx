import type { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export const Button = ({
  type,
  onClick,
  children,
  className,
  disabled,
}: {
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
}) => {
  return (
    <button
      type={type ?? "button"}
      onClick={onClick}
      disabled={disabled}
      className={twMerge(
        "w-full mt-auto py-2 font-semibold text-xl bg-emerald-700 text-white rounded-lg disabled:opacity-25",
        className,
      )}
    >
      {children}
    </button>
  );
};
