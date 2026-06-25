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
    onSubmit(hashtag);
  }

  return (
    <section className="search">
      <form className="search__form" onSubmit={handleSearch}>
        <label className="search__field">
          <input
            className="search__input"
            placeholder="enter hashtag"
            type="text"
            value={hashtag}
            onChange={handleHashtagChange}
            required
            name="search"
          />
        </label>
        <button
          className={`search__submit-btn ${isFormValid ? "" : "search__submit-btn_disabled"}`}
          type="submit"
          disabled={!isFormValid || isLoading}
        />
      </form>
      <span className="search__error">{hashtagError}</span>
    </section>
  );
}

export default Search;
