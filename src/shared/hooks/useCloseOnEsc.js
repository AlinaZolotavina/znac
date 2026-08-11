import { useEffect } from "react";

function useCloseOnEsc(isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleEscClose(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscClose);

    return () => window.removeEventListener("keydown", handleEscClose);
  }, [isOpen, onClose]);
}

export default useCloseOnEsc;
