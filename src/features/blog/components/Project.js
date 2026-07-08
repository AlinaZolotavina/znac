import BlogHashtag from "./BlogHashtag";

function Project({
  loggedIn,
  project,
  onDeleteProjectButtonClick,
  onHashtagClick,
  onEditProjectButtonClick,
}) {
  function handleClick(e) {
    if (e.target.id === "project-delete-btn") {
      onDeleteProjectButtonClick(project);
    } else if (e.target.id === "project-edit-btn") {
      onEditProjectButtonClick(project);
    }
  }
  return (
    <div className="project" onClick={handleClick}>
      <h3 className="project__title">{project.title}</h3>
      <ul className="project__hashtags">
        {project.hashtags.map((hashtag, index) => (
          <BlogHashtag
            key={`${project._id}-${hashtag}-${index}`}
            hashtag={hashtag}
            isSymbolActive={true}
            classname="project__hashtag"
            onHashtagClick={onHashtagClick}
          />
        ))}
      </ul>
      <p className="project__description">{project.text}</p>
      <a
        className="more-details-link"
        href={`${project.link}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        More details
      </a>
      {loggedIn && (
        <div className="project__tools">
          <button
            id="project-edit-btn"
            className="blog-edit-btn"
            onClick={onEditProjectButtonClick}
          />
          <button
            id="project-delete-btn"
            className="blog-delete-btn"
            onClick={onDeleteProjectButtonClick}
          />
        </div>
      )}
    </div>
  );
}

export default Project;
