import BlogHashtag from "./BlogHashtag";

function ProjectHashtags({ hashtags, activeHashtag, onHashtagClick }) {
  const date = Date.now();

  return (
    <div className="project-hashtags">
      <div className="project-hashtags__bear" />
      <div className="project-hashtags__container">
        <BlogHashtag
          key={`all`}
          hashtag="All"
          classname={`project-hashtags__item ${activeHashtag === "All" && "project-hashtags__item_active"}`}
          onHashtagClick={onHashtagClick}
        />
        {hashtags.slice(0, 8).map((value, key) => (
          <BlogHashtag
            key={`${key}${date}`}
            hashtag={value[0]}
            isSymbolActive={false}
            classname={`project-hashtags__item ${activeHashtag === value[0] && "project-hashtags__item_active"}`}
            onHashtagClick={onHashtagClick}
          />
        ))}
      </div>
    </div>
  );
}

export default ProjectHashtags;
