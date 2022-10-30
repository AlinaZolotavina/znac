import PhotoCard from './PhotoCard';

function Gallery({ loggedIn, photos, onPhotoClick }) {
    return (
        <ul className="gallery">
            {photos.map(photo => (
                <PhotoCard 
                    key={photo.key}
                    photo={photo}
                    loggedIn={loggedIn}
                    onPhotoClick={onPhotoClick}
                />
            ))}
        </ul>
    );
}

export default Gallery;

