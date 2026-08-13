import { useEffect, useState } from "react";

function Search({
  onSubmit,
  onClearSearch,
  isLoading,
  hashtag,
  hashtagSetter,
}) {
  const [hashtagError, setHashtagError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const hasError = Boolean(hashtagError);
  const errorId = "gallery-search-error";

  function handleHashtagChange(e) {
    const nextValue = e.target.value;
    const regex = /^[A-Za-zА-Яа-я0-9_]*$/;

    if (nextValue.length === 0) {
      setHashtagError("");
      hashtagSetter("");
      onClearSearch();
      return;
    }

    if (!regex.test(nextValue)) {
      setHashtagError("Only letters, numbers and underscores are allowed");
    } else {
      setHashtagError("");
    }

    hashtagSetter(nextValue);
  }

  useEffect(() => {
    setIsFormValid(Boolean(hashtag && !hashtagError));
  }, [hashtag, hashtagError]);

  function handleSearch(e) {
    e.preventDefault();

    if (!isFormValid || isLoading) {
      return;
    }

    onSubmit(hashtag);
  }

  return (
    <section className="search">
      <form className="search__form" onSubmit={handleSearch}>
        <label className="search__field">
          <input
            id="gallery-search"
            className="search__input"
            placeholder="enter hashtag"
            type="text"
            value={hashtag}
            onChange={handleHashtagChange}
            required
            name="search"
            aria-invalid={hasError ? "true" : undefined}
            aria-describedby={hasError ? errorId : undefined}
          />
        </label>
        <button
          className={`search__submit-btn ${isFormValid && !isLoading ? "" : "search__submit-btn_disabled"}`}
          type="submit"
          disabled={!isFormValid || isLoading}
          aria-label="Search photos"
        />
      </form>
      <span className="search__error" id={errorId}>
        {hashtagError}
      </span>
    </section>
  );
}

export default Search;
