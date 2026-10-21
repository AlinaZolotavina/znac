import PostHashtag from "./PostHashtag";
import { POST_THEMES } from "../../../shared/utils/constants";

function Hashtags({ onClick, activeHashtag, query }) {
  return (
    <section className="post-hashtags">
      {["All", ...POST_THEMES].map((theme) => (
        <PostHashtag
          key={theme}
          hashtag={theme}
          activeHashtag={activeHashtag}
          query={query}
          onClick={onClick}
        />
      ))}
    </section>
  );
}

export default Hashtags;
