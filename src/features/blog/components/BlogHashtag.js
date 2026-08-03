function BlogHashtag({ hashtag, isSymbolActive, classname, onHashtagClick }) {
  const normalizedHashtag = String(hashtag).replace(/^#/, "");
  const displayedHashtag = `${isSymbolActive ? "#" : ""}${normalizedHashtag}`;

  const handleClick = () => {
    if (onHashtagClick) {
      onHashtagClick(normalizedHashtag);
    }
  };

  return (
    <li
      className={classname}
      onClick={handleClick}
      role={onHashtagClick ? "button" : undefined}
      tabIndex={onHashtagClick ? "0" : undefined}
    >
      {displayedHashtag}
    </li>
  );
}

export default BlogHashtag;
