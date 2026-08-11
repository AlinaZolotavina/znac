import { useEffect, useLayoutEffect, useRef } from "react";

function useReturnFocus(isOpen) {
  const previousFocusedElementRef = useRef(null);
  const wasOpenRef = useRef(false);

  useLayoutEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      previousFocusedElementRef.current = document.activeElement;
      wasOpenRef.current = true;
      return;
    }

    if (!isOpen && wasOpenRef.current) {
      const previousFocusedElement = previousFocusedElementRef.current;

      wasOpenRef.current = false;
      previousFocusedElementRef.current = null;

      if (
        previousFocusedElement &&
        document.contains(previousFocusedElement) &&
        typeof previousFocusedElement.focus === "function"
      ) {
        previousFocusedElement.focus();
      }
    }
  }, [isOpen]);

  useEffect(
    () => () => {
      previousFocusedElementRef.current = null;
      wasOpenRef.current = false;
    },
    [],
  );
}

export default useReturnFocus;
