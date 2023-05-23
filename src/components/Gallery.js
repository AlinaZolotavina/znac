import PhotoCard from './PhotoCard';
import notFound from '../images/photos-not-found-icon.svg';
function Gallery({ loggedIn, photos, onPhotoClick, onDeleteBtnClick, photosQuantity }) {

    return (
        <>
            {
                photos.length === 0 ?
                <div className='photos-not-found'>
                    <img className='photos-not-found__icon' src={notFound} alt='photos not found icon'/>
                    <p className='photos-not-found__text'>Nothing was found! Try another hashtag</p>
                </div>
                : <ul className="gallery"> 
                    {photos
                        .slice(0, photosQuantity)
                        .map(photo => (
                            <PhotoCard 
                                key={photo._id}
                                photo={photo}
                                loggedIn={loggedIn}
                                onPhotoClick={onPhotoClick}
                                onDeleteBtnClick={onDeleteBtnClick}
                            />
                    ))}
                </ul>
            }
        </>
    );
}

export default Gallery;

