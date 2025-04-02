import type { ReactNode } from "react";
import type { TOverlayControls } from "../overlayElement";

type TModalType = "floating" | "popup";

interface IBaseModalProps {
  children?: ReactNode;
  classNameBody?: string;
  disableClosing?: boolean;
  classNameBackdrop?: string;
  onOutsideClick?: () => void;
  closeOnOutsideClick?: boolean;
  animationDuration?: `${number}ms`;
}

export interface IModalProps extends IBaseModalProps {
  ref: React.Ref<TOverlayControls>;
  defaultOpen?: boolean;
  onOpen?: (arg?: unknown) => void;
  onClose?: (arg?: unknown) => void;
  forceState?: TModalType | undefined;
}

export interface IModalBodyProps extends IBaseModalProps {
  isOpen: boolean;
  close: () => void;
}
