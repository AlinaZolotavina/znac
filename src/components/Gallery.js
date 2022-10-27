import PhotoCard from './PhotoCard';

function Gallery({ photos, onPhotoClick }) {
    return (
        <ul className="gallery">
            {photos.map(photo => (
                <PhotoCard 
                    key={photo.key}
                    photo={photo}
                    onPhotoClick={onPhotoClick}
                />
            ))}
        </ul>
    );
}

export default Gallery;

