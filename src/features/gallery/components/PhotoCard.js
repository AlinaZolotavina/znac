import { useState, useEffect } from "react";
import errorImage from "../../../app/assets/image-error.svg";

function PhotoCard({ photo, loggedIn, onPhotoClick, onDeleteBtnClick }) {
  const [imageSrc, setImageSrc] = useState(photo.thumbnail || photo.link);

  useEffect(() => {
    setImageSrc(photo.thumbnail || photo.link);
  }, [photo.thumbnail, photo.link]);

  function handlePhotoClick() {
    onPhotoClick(photo);
  }

  function handlePhotoDelete() {
    onDeleteBtnClick(photo);
  }

  return (
    <li className="photo-card">
      <button
        type="button"
        className="photo-card__button"
        onClick={handlePhotoClick}
        aria-label={`Open photo ${photo.hashtags}`}
      >
        <img
          className="photo-card__image"
          src={imageSrc}
          alt={photo.hashtags}
          loading="lazy"
          onError={() => {
            if (imageSrc !== photo.link && photo.link) {
              setImageSrc(photo.link);
            } else {
              setImageSrc(errorImage);
            }
          }}
        />
      </button>

      {loggedIn && (
        <button
          className="photo-card__delete-btn"
          type="button"
          onClick={handlePhotoDelete}
          aria-label={`Delete photo ${photo.hashtags}`}
        />
      )}
    </li>
  );
}

export default PhotoCard;
