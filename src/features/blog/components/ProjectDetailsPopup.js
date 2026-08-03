import { useEffect } from "react";
import BlogHashtag from "./BlogHashtag";
import CloseButton from "./BlogCloseButton";
import normalizeHashtags from "../utils/normalizeHashtags";

function ProjectDetailsPopup({ project, isOpen, onClose, onHashtagClick }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleEscClose(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscClose);

    return () => window.removeEventListener("keydown", handleEscClose);
  }, [isOpen, onClose]);

  if (!project) {
    return null;
  }

  const projectHashtags = normalizeHashtags(project.hashtags);

  function handleOverlayMouseDown(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className={`popup popup_type_project-details ${isOpen ? "popup_is-opened" : ""}`}
      onMouseDown={handleOverlayMouseDown}
    >
      <article className="project-details-popup">
        <h2 className="project-details-popup__title">{project.title}</h2>
        <ul className="project-details-popup__hashtags">
          {projectHashtags.map((hashtag, index) => (
            <BlogHashtag
              key={`${project._id}-details-${hashtag}-${index}`}
              hashtag={hashtag}
              isSymbolActive={true}
              classname="project__hashtag"
              onHashtagClick={onHashtagClick}
            />
          ))}
        </ul>
        <p className="project-details-popup__description">{project.text}</p>
        <a
          className="more-details-link project-details-popup__link"
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          More details
        </a>
        <CloseButton classname="close-btn popup__close-btn" onClick={onClose} />
      </article>
    </div>
  );
}

export default ProjectDetailsPopup;
