import { useLayoutEffect } from "react";
import { getFocusableElements } from "../utils/focusUtils";

function useInitialFocus(isOpen, containerRef) {
  useLayoutEffect(() => {
    if (!isOpen || !containerRef.current) {
      return;
    }

    const [firstFocusableElement] = getFocusableElements(containerRef.current);
    const elementToFocus = firstFocusableElement || containerRef.current;

    if (typeof elementToFocus.focus === "function") {
      elementToFocus.focus();
    }
  }, [isOpen, containerRef]);
}

export default useInitialFocus;
