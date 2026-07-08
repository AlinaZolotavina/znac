import { useState, useEffect } from "react";
import errorImage from "../../../app/assets/image-error.svg";

function PhotoCard({ photo, loggedIn, onPhotoClick, onDeleteBtnClick }) {
  const [imageSrc, setImageSrc] = useState(photo.link);

  useEffect(() => {
    setImageSrc(photo.link);
  }, [photo.link]);

  function handlePhotoClick() {
    onPhotoClick(photo);
  }

  function handlePhotoDelete() {
    onDeleteBtnClick(photo);
  }

  return (
    <li className="photo-card">
      <img
        className="photo-card__image"
        src={imageSrc}
        alt={photo.hashtags}
        loading="lazy"
        onError={(e) => {
          if (e.currentTarget.src !== errorImage) {
            setImageSrc(errorImage);
          }
        }}
        onClick={handlePhotoClick}
      />

      {loggedIn && (
        <button
          className="photo-card__delete-btn"
          onClick={handlePhotoDelete}
        />
      )}
    </li>
  );
}

export default PhotoCard;
