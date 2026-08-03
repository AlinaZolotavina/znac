import { useEffect, useRef, useState } from "react";

function useOverflow(watchValue) {
  const ref = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    function updateOverflowState() {
      const element = ref.current;

      if (!element) {
        return;
      }

      setIsOverflowing(element.scrollHeight > element.clientHeight);
    }

    updateOverflowState();
    window.addEventListener("resize", updateOverflowState);

    return () => window.removeEventListener("resize", updateOverflowState);
  }, [watchValue]);

  return { ref, isOverflowing };
}

export default useOverflow;
