import BlogHashtag from "./BlogHashtag";
import BlogActionButtons from "./BlogActionButtons";
import useOverflow from "../hooks/useOverflow";
import normalizeHashtags from "../utils/normalizeHashtags";

function Project({
  loggedIn,
  project,
  onDeleteProjectButtonClick,
  onHashtagClick,
  onEditProjectButtonClick,
  onSeeMoreProjectClick,
}) {
  const {
    ref: descriptionRef,
    isOverflowing: isDescriptionOverflowing,
  } = useOverflow(project.text);

  const shouldShowMore = onSeeMoreProjectClick && isDescriptionOverflowing;
  const projectHashtags = normalizeHashtags(project.hashtags);

  return (
    <li className="project">
      <h3 className="project__title">{project.title}</h3>
      <ul className="project__hashtags">
        {projectHashtags.map((hashtag, index) => (
          <BlogHashtag
            key={`${project._id}-${hashtag}-${index}`}
            hashtag={hashtag}
            isSymbolActive={true}
            classname="project__hashtag"
            onHashtagClick={onHashtagClick}
          />
        ))}
      </ul>
      <p className="project__description">
        <span className="project__description-text" ref={descriptionRef}>
          {project.text}
        </span>
        {shouldShowMore && (
          <button
            className="project__see-more"
            type="button"
            onClick={() => onSeeMoreProjectClick(project)}
          >
            ... see more →
          </button>
        )}
      </p>
      <div className="project__actions">
        <a
          className="more-details-link"
          href={`${project.link}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          More details
        </a>
      </div>
      {loggedIn && (
        <div className="project__tools">
          <BlogActionButtons
            editId="project-edit-btn"
            deleteId="project-delete-btn"
            editLabel="Edit project"
            deleteLabel="Delete project"
            onEdit={() => onEditProjectButtonClick(project)}
            onDelete={() => onDeleteProjectButtonClick(project)}
          />
        </div>
      )}
    </li>
  );
}

export default Project;
