function postHashtag({ hashtag, activeHashtag, query, onClick }) {
  const isActive = hashtag === activeHashtag;

  function handleClick() {
    onClick(hashtag, query);
  }

  return (
    <button
      className={`post-hashtags__item ${
        isActive ? "post-hashtags__item_state_active" : ""
      }`}
      onClick={handleClick}
      type="button"
      aria-pressed={isActive}
    >
      {hashtag}
    </button>
  );
}

export default postHashtag;
