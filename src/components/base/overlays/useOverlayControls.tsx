import { useState } from "react";
import { removeActiveFocus } from "../../../utils/removeActiveFocus";
import type { TOverlayToggleOptions } from "./overlayElement";

export const useOverlayControls = ({
  defaultOpen,
  onOpen,
  onClose,
}: {
  defaultOpen?: boolean;
  onOpen?: (arg?: unknown) => void;
  onClose?: (arg?: unknown) => void;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen || false);

  const openOverlay = (arg?: unknown, options?: TOverlayToggleOptions) => {
    /**
     * checking if the modal is already open prevents triggering onOpen accidentally
     * but in some cases we want to call onOpen function with different arguments
     */
    if (isOpen === true && !options?.toggleSameState) {
      return;
    }
    setIsOpen(true);

    if (onOpen && typeof onOpen === "function") {
      onOpen(arg);
    }
  };

  const closeOverlay = (arg?: unknown, options?: TOverlayToggleOptions) => {
    /**
     * checking if the modal is already closed prevents triggering onClose accidentally
     * but in some cases we want to call onClose function with different arguments
     */
    if (isOpen === false && !options?.toggleSameState) {
      return;
    }

    removeActiveFocus();
    setIsOpen(false);

    if (onClose && typeof onClose === "function") {
      onClose(arg);
    }
  };

  return { isOpen, openOverlay, closeOverlay };
};
