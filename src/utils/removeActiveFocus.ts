export const removeActiveFocus = () => {
  const activeElement = document.activeElement;
  if (!activeElement) {
    return;
  }

  if ("blur" in activeElement && typeof activeElement.blur === "function") {
    activeElement.blur();
  }
};
