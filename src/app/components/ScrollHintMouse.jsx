import { useEffect, useRef, useState } from "react";

function ScrollHintMouse({ onClick, ariaLabel }) {
  const [isVisible, setIsVisible] = useState(false);
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    function handleScroll() {
      hasScrolledRef.current = true;
      setIsVisible(false);
    }

    const timer = window.setTimeout(() => {
      if (!hasScrolledRef.current) {
        setIsVisible(true);
      }
    }, 500);

    window.addEventListener("scroll", handleScroll, { once: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <button
      className="scroll-hint-mouse"
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <span className="scroll-hint-mouse__icon" aria-hidden="true" />
      <span className="scroll-hint-mouse__arrow" aria-hidden="true">
        &#8595;
      </span>
    </button>
  );
}

export default ScrollHintMouse;
