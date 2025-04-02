import type { TouchEvent } from "react";
import { useRef } from "react";
import { twMerge } from "tailwind-merge";
import type { IModalBodyProps } from "./modalProps";

export const ModalPopupBody = ({
  isOpen,
  close,
  classNameBody,
  classNameBackdrop,
  children,
  closeOnOutsideClick,
  disableClosing,
  animationDuration,
  onOutsideClick,
}: IModalBodyProps) => {
  const THRESHOLD = 50;

  const originalStartingPoint = useRef<number | null>(null);
  const startingPoint = useRef<number | null>(null);

  const popupBodyRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const calcDragDiff = (yPos: number) => {
    return Math.max(yPos - (startingPoint.current ?? 0), 0);
  };

  const onDragStart = (yPos: number) => {
    originalStartingPoint.current = yPos;
    startingPoint.current = yPos;

    if (popupBodyRef.current) {
      popupBodyRef.current.style.transitionDuration = "0ms";
    }
  };

  const onDragEnd = (yPos: number) => {
    if (popupBodyRef.current) {
      popupBodyRef.current.style.transitionDuration = "";
      popupBodyRef.current.style.transform = "";
    }

    if (calcDragDiff(yPos) < THRESHOLD) {
      return;
    }

    startingPoint.current = null;

    if (modalRef.current) {
      modalRef.current.dataset.open = "false";
    }
    if (popupBodyRef.current) {
      popupBodyRef.current.dataset.open = "false";
    }

    close();
  };

  const onDragMove = (yPos: number) => {
    if (!popupBodyRef.current) {
      return;
    }

    const diff = calcDragDiff(yPos);
    if (diff > 0) {
      popupBodyRef.current.style.transform = `translateY(${diff}px)`;
    }
  };

  const onBackdropClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (closeOnOutsideClick && !disableClosing) {
      close();
    }

    if (typeof onOutsideClick === "function") {
      onOutsideClick();
    }
  };

  const customStyles = `${isOpen ? "pointer-events-auto bg-black/40" : "pointer-events-none"} ${
    closeOnOutsideClick ? "cursor-pointer" : ""
  }`;

  /**
   * - Check if the targeted element is inside of a scrollable container
   * or is inside a container that has a modal drag lock on it
   */
  const getTargetScrollYOffset = (target: HTMLElement) => {
    const scrollLock = !!target.closest("[data-modal-drag-lock]");
    if (scrollLock) {
      return 1;
    }

    /**
     * - Find the closest scrollable parent element that does not
     * have "overflow-hidden" on it and return its scrollTop value
     */
    const scrollParent = target.closest('[class*="overflow-"]:not(.overflow-hidden)');
    return scrollParent && scrollParent.scrollTop ? scrollParent.scrollTop : 0;
  };

  /**
   * If the user is scrolling inside of a scrollable container, we should prevent the
   * modal from dragging, and only on the second touch event, we should allow it again
   */
  const preventDragRef = useRef(false);

  const touchEvents = {
    onTouchStart: (e: TouchEvent<HTMLDivElement>) => {
      e.stopPropagation();
      !disableClosing && onDragStart(e.changedTouches[0].clientY);
    },
    onTouchMove: (e: TouchEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (preventDragRef.current) {
        return;
      }

      /**
       * prevent dragging if the scroll container is not at the top
       */
      const scrollYOffset = getTargetScrollYOffset(e.target as HTMLElement);
      if (scrollYOffset != 0) {
        preventDragRef.current = true;
        onDragEnd(startingPoint.current ?? 0);
      } else {
        !disableClosing && onDragMove(e.changedTouches[0].clientY);
      }
    },
    onTouchEnd: (e: TouchEvent<HTMLDivElement>) => {
      e.stopPropagation();

      if (preventDragRef.current) {
        preventDragRef.current = false;
        onDragEnd(startingPoint.current ?? 0);
      } else {
        !disableClosing && onDragEnd(e.changedTouches[0].clientY);
      }
    },
  } as const;

  return (
    <div
      {...touchEvents}
      data-open={!!isOpen}
      ref={modalRef}
      onClick={onBackdropClick}
      style={{ transitionDuration: animationDuration ?? "300ms" }}
      className={twMerge(
        `fixed inset-0 flex items-end z-[200] transition-all overscroll-y-contain ${customStyles}`,
        classNameBackdrop,
      )}
    >
      <div
        {...touchEvents}
        ref={popupBodyRef}
        data-open={!!isOpen}
        onClick={(e) => e.stopPropagation()}
        style={{ transitionDuration: animationDuration ?? "300ms" }}
        className={twMerge(
          `
            !max-w-full w-full fixed flex flex-col rounded-t-lg bg-gradient-to-br from-slate-600 to-slate-900
            translate-y-full transition-all data-[open=true]:translate-y-0 
          `,
          classNameBody,
        )}
      >
        <div className="max-h-[100dvh] flex flex-col basis-full">{children}</div>
      </div>
    </div>
  );
};
