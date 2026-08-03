import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

const GAP = 12;
const MOBILE_BREAKPOINT = 650;

function ProjectHashtags({ hashtags, activeHashtag, onHashtagClick }) {
  const containerRef = useRef(null);
  const itemMeasureRefs = useRef([]);
  const moreMeasureRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const tags = useMemo(
    () => ["All", ...hashtags.slice(0, 8).map((value) => value[0])],
    [hashtags],
  );

  const getRowsCount = useCallback(() => {
    if (typeof window === "undefined") {
      return 1;
    }

    return window.innerWidth <= MOBILE_BREAKPOINT ? 2 : 1;
  }, []);

  const fitsIntoRows = useCallback((widths, containerWidth, maxRows) => {
    let rows = 1;
    let rowWidth = 0;

    return widths.every((width) => {
      const nextWidth = rowWidth === 0 ? width : rowWidth + GAP + width;

      if (nextWidth <= containerWidth) {
        rowWidth = nextWidth;
        return true;
      }

      rows += 1;
      rowWidth = width;

      return rows <= maxRows;
    });
  }, []);

  const updateVisibleCount = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth || 0;
    const moreWidth = moreMeasureRef.current?.offsetWidth || 0;
    const itemWidths = itemMeasureRefs.current
      .slice(0, tags.length)
      .map((item) => item?.offsetWidth || 0);

    if (!containerWidth || itemWidths.some((width) => !width) || !moreWidth) {
      return;
    }

    const maxRows = getRowsCount();

    if (fitsIntoRows(itemWidths, containerWidth, maxRows)) {
      setVisibleCount(tags.length);
      return;
    }

    for (let count = tags.length - 1; count >= 1; count -= 1) {
      const widthsWithMore = [...itemWidths.slice(0, count), moreWidth];

      if (fitsIntoRows(widthsWithMore, containerWidth, maxRows)) {
        setVisibleCount(count);
        return;
      }
    }

    setVisibleCount(1);
  }, [fitsIntoRows, getRowsCount, tags.length]);

  useLayoutEffect(() => {
    updateVisibleCount();
  }, [updateVisibleCount]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateVisibleCount);
      return () => window.removeEventListener("resize", updateVisibleCount);
    }

    const observer = new ResizeObserver(updateVisibleCount);
    observer.observe(container);

    return () => observer.disconnect();
  }, [updateVisibleCount]);

  const handleHashtagClick = (hashtag) => {
    setIsDropdownOpen(false);
    onHashtagClick(hashtag);
  };

  const visibleTags = tags.slice(0, visibleCount ?? tags.length);
  const hiddenTags = tags.slice(visibleCount ?? tags.length);
  const hasHiddenTags = hiddenTags.length > 0;

  return (
    <div className="project-hashtags">
      <div className="project-hashtags__container" ref={containerRef}>
        {visibleTags.map((hashtag) => (
          <button
            key={hashtag}
            className={`project-hashtags__item ${
              activeHashtag === hashtag ? "project-hashtags__item_active" : ""
            }`}
            type="button"
            onClick={() => handleHashtagClick(hashtag)}
          >
            {hashtag}
          </button>
        ))}

        {hasHiddenTags && (
          <div className="project-hashtags__more">
            <button
              className={`project-hashtags__item project-hashtags__more-button ${
                isDropdownOpen ? "project-hashtags__more-button_open" : ""
              }`}
              type="button"
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
              onClick={() => setIsDropdownOpen((current) => !current)}
            >
              More
              <span className="project-hashtags__more-icon" aria-hidden="true" />
            </button>

            {isDropdownOpen && (
              <div className="project-hashtags__dropdown" role="listbox">
                {hiddenTags.map((hashtag) => (
                  <button
                    key={hashtag}
                    className={`project-hashtags__dropdown-item ${
                      activeHashtag === hashtag
                        ? "project-hashtags__dropdown-item_active"
                        : ""
                    }`}
                    type="button"
                    role="option"
                    aria-selected={activeHashtag === hashtag}
                    onClick={() => handleHashtagClick(hashtag)}
                  >
                    {hashtag}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="project-hashtags__measure" aria-hidden="true">
        {tags.map((hashtag, index) => (
          <span
            key={hashtag}
            className="project-hashtags__item"
            ref={(element) => {
              itemMeasureRefs.current[index] = element;
            }}
          >
            {hashtag}
          </span>
        ))}
        <span
          className="project-hashtags__item project-hashtags__more-button"
          ref={moreMeasureRef}
        >
          More
          <span className="project-hashtags__more-icon" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}

export default ProjectHashtags;
