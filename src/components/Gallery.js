import PhotoCard from './PhotoCard';

function Gallery({ loggedIn, photos, onPhotoClick, onDeleteBtnClick }) {
    return (
        <ul className="gallery">
            {photos.map(photo => (
                <PhotoCard 
                    key={photo.key}
                    photo={photo}
                    loggedIn={loggedIn}
                    onPhotoClick={onPhotoClick}
                    onDeleteBtnClick={onDeleteBtnClick}
                />
            ))}
        </ul>
    );
}

export default Gallery;

