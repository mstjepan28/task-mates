import type { useOverlayControls } from "./useOverlayControls";

export type TOverlayToggleOptions = {
  toggleSameState?: boolean;
  skipAnimation?: boolean;
};

export type TOverlayControls = {
  isOpen: ReturnType<typeof useOverlayControls>["isOpen"];
  open: ReturnType<typeof useOverlayControls>["openOverlay"];
  close: ReturnType<typeof useOverlayControls>["closeOverlay"];
};

export type TOverlayRef = React.RefObject<TOverlayControls | null>;

export interface IOverlayElement {
  baseRef: TOverlayRef;
}
