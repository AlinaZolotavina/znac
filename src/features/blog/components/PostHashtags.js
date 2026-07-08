import PostHashtag from "./PostHashtag";

function Hashtags({ onClick, activeHashtag, query }) {
  return (
    <section className="post-hashtags">
      <PostHashtag
        hashtag="All"
        activeHashtag={activeHashtag}
        query={query}
        onClick={onClick}
      />
      <PostHashtag
        hashtag="Web development"
        activeHashtag={activeHashtag}
        query={query}
        onClick={onClick}
      />
      <PostHashtag
        hashtag="Web design"
        activeHashtag={activeHashtag}
        query={query}
        onClick={onClick}
      />
      <PostHashtag
        hashtag="Travel"
        activeHashtag={activeHashtag}
        query={query}
        onClick={onClick}
      />
      <PostHashtag
        hashtag="Books"
        activeHashtag={activeHashtag}
        query={query}
        onClick={onClick}
      />
      <PostHashtag
        hashtag="Daily life"
        activeHashtag={activeHashtag}
        query={query}
        onClick={onClick}
      />
    </section>
  );
}

export default Hashtags;
