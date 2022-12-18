function PhotoCard({ photo, loggedIn,  onPhotoClick, onDeleteBtnClick }) {
    function handlePhotoClick() {
        onPhotoClick(photo);
    }

    function handlePhotoDelete() {
        onDeleteBtnClick(photo);
    }

    return (
        <li className="photo-card">
            <img className="photo-card__image" src={photo.link} alt={photo.hashtags} onClick={handlePhotoClick} />
            {loggedIn && <button className="photo-card__delete-btn" onClick={handlePhotoDelete}/>}
        </li>
    );
}

export default PhotoCard;