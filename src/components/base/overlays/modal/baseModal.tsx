import { useImperativeHandle, useMemo, useState } from "react";
import { DisplaySize, useResponsive } from "../../../../hooks/useResponsive";
import type { TOverlayControls } from "../overlayElement";
import { useOverlayControls } from "../useOverlayControls";
import { ModalFloatingBody } from "./modalFloatingBody";
import { ModalPopupBody } from "./modalPopupBody";
import type { IModalProps } from "./modalProps";

export const BaseModal = ({ ref, ...props }: IModalProps) => {
  const [shouldSkipAnimation, setShouldSkipAnimation] = useState(false);
  const controls = useOverlayControls({ ...props });

  useImperativeHandle(ref, (): TOverlayControls => {
    return {
      open: (args, options) => {
        controls.openOverlay(args, options);
        setShouldSkipAnimation(!!options?.skipAnimation);
      },
      close: (args, options) => {
        controls.closeOverlay(args, options);
        setShouldSkipAnimation(!!options?.skipAnimation);
      },
      isOpen: controls.isOpen,
    };
  });

  const screenSize = useResponsive();

  /**
   * - ModalFloatingBody - Modal that is displayed as a floating element in
   *  the center of the screen.
   * - ModalPopupBody - Modal that pops up from the bottom of the screen,
   * can be dragged away to close it.
   */
  const Modal = useMemo(() => {
    if (props.forceState === "floating") {
      return ModalFloatingBody;
    }

    if (props.forceState === "popup") {
      return ModalPopupBody;
    }

    return screenSize > DisplaySize.MOBILE ? ModalFloatingBody : ModalPopupBody;
  }, [screenSize, props.forceState]);

  return (
    <Modal
      isOpen={controls.isOpen}
      close={controls.closeOverlay}
      classNameBody={props.classNameBody}
      disableClosing={props.disableClosing}
      onOutsideClick={props.onOutsideClick}
      classNameBackdrop={props.classNameBackdrop}
      closeOnOutsideClick={props.closeOnOutsideClick}
      animationDuration={shouldSkipAnimation ? "0ms" : props.animationDuration}
    >
      {props.children}
    </Modal>
  );
};
