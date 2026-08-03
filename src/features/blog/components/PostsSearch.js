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
    const value = e.target.value;
    const regex = /^[A-Za-zА-Яа-я0-9_]*$/;
    if (!regex.test(value)) {
      setQueryError("Only letters, numbers and underscores are allowed");
    } else {
      setQueryError("");
    }
    querySetter(value);

    if (value.trim() === "") {
      onSubmit("");
    }
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
    <form className="posts-search" onSubmit={handleSearch}>
      <label className="posts-search__field">
        <span className="visually-hidden">Search posts</span>
        <input
          className="posts-search__input"
          placeholder={`${isSmall ? "Search..." : "Search posts..."}`}
          type="text"
          value={query}
          onChange={handleQueryChange}
          required
        />
      </label>
      <button
        className={`posts-search__submit-btn ${
          isFormValid ? "" : "posts-search__submit-btn_disabled"
        }`}
        type="submit"
        disabled={!isFormValid || isLoading}
      >
        <span className="posts-search__icon" aria-hidden="true" />
        <span className="visually-hidden">Search</span>
      </button>
    </form>
    // <span className="posts-search__error">{queryError}</span>
  );
}

export default PostsSearch;
