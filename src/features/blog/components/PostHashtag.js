function postHashtag({ hashtag, activeHashtag, query, onClick }) {
  function handleClick() {
    onClick(hashtag, query);
  }
  return (
    <span
      className={`post-hashtags__item ${hashtag === activeHashtag && "post-hashtags__item_state_active"}`}
      onClick={handleClick}
    >
      {hashtag}
    </span>
  );
}

export default postHashtag;
