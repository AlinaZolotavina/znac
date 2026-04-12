import { useEffect, useState } from "react";

function PostsSearch({
  onSubmit,
  isLoading,
  query,
  querySetter,
  activeHashtag,
}) {
  const isSmall = window.innerWidth < 500;
  const [queryError, setQueryError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  function handleQueryChange(e) {
    const regex = /^[A-Za-zА-Яа-я0-9_]*$/;
    if (!regex.test(e.target.value)) {
      setQueryError("Only letters, numbers and underscores are allowed");
    } else {
      setQueryError("");
    }
    querySetter(e.target.value);
  }

  useEffect(() => {
    if (query && !queryError) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [query, queryError]);

  useEffect(() => {
    if (!query) {
      setQueryError("");
    }
  }, [query]);

  function handleSearch(e) {
    e.preventDefault();
    onSubmit(query, activeHashtag);
  }

  return (
    <div className="search-container">
      <div className="search-container__bear" />
      <div className="search-container__line" />
      <div className="search-container__star" />
      <section className="posts-search">
        <form className="posts-search__form" onSubmit={handleSearch}>
          <label className="posts-search__field">
            <input
              className="posts-search__input"
              placeholder={`${isSmall ? "Search..." : "What do you wanna find?"}`}
              type="text"
              value={query}
              onChange={handleQueryChange}
              required
            />
          </label>
          <button
            className={`posts-search__submit-btn ${isFormValid ? "" : "posts-search__submit-btn_disabled"}`}
            type="submit"
            disabled={!isFormValid || isLoading}
          />
        </form>
        <span className="posts-search__error">{queryError}</span>
      </section>
    </div>
  );
}

export default PostsSearch;
