import { useRef } from "react";
import BlogHashtag from "./BlogHashtag";
import CloseButton from "./BlogCloseButton";
import normalizeHashtags from "../utils/normalizeHashtags";
import useInitialFocus from "../../../shared/hooks/useInitialFocus";
import useFocusTrap from "../../../shared/hooks/useFocusTrap";
import useReturnFocus from "../../../shared/hooks/useReturnFocus";
import useCloseOnEsc from "../../../shared/hooks/useCloseOnEsc";
import useLockBodyScroll from "../../../shared/hooks/useLockBodyScroll";
import useOverlayClickClose from "../../../shared/hooks/useOverlayClickClose";

function ProjectDetailsPopup({ project, isOpen, onClose, onHashtagClick }) {
  const popupRef = useRef(null);

  useReturnFocus(isOpen);
  useInitialFocus(isOpen, popupRef);
  useFocusTrap(isOpen, popupRef);
  useCloseOnEsc(isOpen, onClose);
  useLockBodyScroll(isOpen);

  const handleOverlayClickClose = useOverlayClickClose(isOpen, onClose);

  if (!isOpen || !project) {
    return null;
  }

  const projectHashtags = normalizeHashtags(project.hashtags);

  return (
    <div
      className="popup popup_type_project-details popup_is-opened"
      onMouseDown={handleOverlayClickClose}
    >
      <article
        ref={popupRef}
        className="project-details-popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-details-title"
        tabIndex={-1}
      >
        <h2 className="project-details-popup__title" id="project-details-title">{project.title}</h2>
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
        <CloseButton
          classname="blog-close-btn blog-close-btn_location_project-details-popup"
          onClick={onClose}
          ariaLabel="Close dialog"
        />
      </article>
    </div>
  );
}

export default ProjectDetailsPopup;
