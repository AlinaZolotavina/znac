function BlogHashtag({ hashtag, isSymbolActive, classname, onHashtagClick }) {
  const normalizedHashtag = String(hashtag).replace(/^#/, "");
  const displayedHashtag = `${isSymbolActive ? "#" : ""}${normalizedHashtag}`;

  const handleClick = () => {
    if (onHashtagClick) {
      onHashtagClick(normalizedHashtag);
    }
  };

  if (!onHashtagClick) {
    return <li className={classname}>{displayedHashtag}</li>;
  }

  return (
    <li className={classname}>
      <button
        className="blog-hashtag__button"
        type="button"
        onClick={handleClick}
      >
        {displayedHashtag}
      </button>
    </li>
  );
}

export default BlogHashtag;
