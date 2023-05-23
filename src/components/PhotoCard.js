import { useState, useEffect } from 'react';
import errorImage from '../images/image-error.png';

function PhotoCard({
    photo,
    loggedIn,
    onPhotoClick,
    onDeleteBtnClick
}) {
    const [currentImage, setCurrentImage] = useState(errorImage);
    const [isLoading, setIsLoading] = useState(true);

    const fetchImage = (src) => {
        const loadingImage = new Image();
        loadingImage.src = src;
        loadingImage.onload = () => {
            setCurrentImage(loadingImage.src);
            setIsLoading(false);
        };
        loadingImage.onerror = () => {
            setCurrentImage(errorImage);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchImage(photo.link);
    })

    function handlePhotoClick() {
        onPhotoClick(photo);
    }

    function handlePhotoDelete() {
        onDeleteBtnClick(photo);
    }

    return (
        <li className="photo-card">
            <img
                className={`${!isLoading ? 'photo-card__image' : 'photo-card__placeholder'}`}
                src={currentImage}
                alt={photo.hashtags}
                onClick={handlePhotoClick}
                style={{ transition: `opacity 1s ease` }}
                loading='lazy' />
            {loggedIn && <button className="photo-card__delete-btn" onClick={handlePhotoDelete}/>}
        </li>
    );
}

export default PhotoCard;