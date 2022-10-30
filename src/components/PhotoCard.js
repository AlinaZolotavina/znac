function PhotoCard({ photo, loggedIn,  onPhotoClick }) {
    function handlePhotoClick() {
        onPhotoClick(photo);
    }

    return (
        <li className="photo-card">
            <img className="photo-card__image" src={photo.src} alt={photo.alt} onClick={handlePhotoClick} />
            {loggedIn && <button className="photo-card__delete-btn" />}
        </li>
    );
}

export default PhotoCard;