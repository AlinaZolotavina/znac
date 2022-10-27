function PhotoCard({ photo, onPhotoClick }) {
    function handlePhotoClick() {
        onPhotoClick(photo);
    }

    return (
        <li className="photo-card">
            <img className="photo-card__image" src={photo.src} alt={photo.alt} onClick={handlePhotoClick} />
            <button className="photo-card__delete-btn" />
        </li>
    );
}

export default PhotoCard;