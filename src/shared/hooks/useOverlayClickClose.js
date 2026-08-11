import { useCallback } from "react";

function useOverlayClickClose(isOpen, onClose) {
  const handleOverlayClickClose = useCallback(
    (e) => {
      if (!isOpen) {
        return;
      }

      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [isOpen, onClose],
  );

  return handleOverlayClickClose;
}

export default useOverlayClickClose;
