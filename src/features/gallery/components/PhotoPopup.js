import { useState, useEffect, useRef } from "react";
import errorImage from "../../../app/assets/image-error.svg";

import EditButton from "../../../app/components/EditButton";
import PhotoHashtags from "./PhotoHashtags";
import CloseButton from "../../../app/components/CloseButton";
import useInitialFocus from "../../../shared/hooks/useInitialFocus";
import useFocusTrap from "../../../shared/hooks/useFocusTrap";
import useReturnFocus from "../../../shared/hooks/useReturnFocus";
import useCloseOnEsc from "../../../shared/hooks/useCloseOnEsc";
import useLockBodyScroll from "../../../shared/hooks/useLockBodyScroll";
import useOverlayClickClose from "../../../shared/hooks/useOverlayClickClose";

function PhotoPopup({
  loggedIn,
  isOpen,
  photo,
  photoHashtags,
  views,
  onClose,
  onHashtagClick,
  areHashtagsEditing,
  onEditHashtags,
  isSendingReq,
  onEditHashtagsBtnClick,
  onPhotoFlip,
  isLeftFlipDisabled,
  isRightFlipDisabled,
}) {
  const [imageSrc, setImageSrc] = useState(photo?.link);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImageSrc(photo?.link);
    setHasError(false);
  }, [photo?.link]);

  const hashtags = Array.isArray(photoHashtags)
    ? photoHashtags.flatMap((tag) => tag.split(/\s+/))
    : typeof photoHashtags === "string"
      ? photoHashtags.split(/\s+/)
      : [];

  function handleRightFlip() {
    onPhotoFlip("right");
  }

  function handleLeftFlip() {
    onPhotoFlip("left");
  }

  const popupRef = useRef(null);

  useReturnFocus(isOpen);
  useInitialFocus(isOpen, popupRef);
  useFocusTrap(isOpen, popupRef);
  useCloseOnEsc(isOpen, onClose);
  useLockBodyScroll(isOpen);

  const handleOverlayClickClose = useOverlayClickClose(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="popup popup_type_photo popup_is-opened"
      onMouseDown={handleOverlayClickClose}
    >
      <div
        ref={popupRef}
        className="popup__wrapper"
        role="dialog"
        aria-modal="true"
        aria-label="Photo preview"
        tabIndex={-1}
      >
        <div className="popup__photo-container">
          <button
            className={`popup__left-flip flip-btn ${
              isLeftFlipDisabled && "flip-btn_hidden"
            }`}
            onClick={handleLeftFlip}
            disabled={isLeftFlipDisabled}
            aria-label="Previous photo"
          />

          <div className="popup__photo">
            <img
              className={hasError ? "popup__image-error" : "popup__image"}
              src={imageSrc}
              alt={photo?.hashtags}
              onError={(e) => {
                e.currentTarget.onerror = null;
                setHasError(true);
                setImageSrc(errorImage);
              }}
            />

            <CloseButton
              classname="close-btn popup__close-btn"
              onClick={onClose}
              ariaLabel="Close dialog"
            />
          </div>

          <button
            className={`popup__right-flip flip-btn ${
              isRightFlipDisabled && "flip-btn_hidden"
            }`}
            onClick={handleRightFlip}
            disabled={isRightFlipDisabled}
            aria-label="Next photo"
          />

          <div className="popup__caption">
            <div className="popup__hashtags">
              {loggedIn && (
                <EditButton
                  classname="edit-btn edit-hashtags-btn"
                  onClick={onEditHashtagsBtnClick}
                  ariaLabel="Edit photo hashtags"
                />
              )}

              <PhotoHashtags
                classname="hashtags hashtags_to-photo"
                photoHashtags={hashtags}
                onClick={onHashtagClick}
                areHashtagsEditing={areHashtagsEditing}
                onEditHashtags={onEditHashtags}
                isSendingReq={isSendingReq}
                photoId={photo?._id}
              />
            </div>

            <div className="views">
              <p className="views__number">{views}</p>
              <div className="views__icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhotoPopup;
