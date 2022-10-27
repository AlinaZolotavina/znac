import Hashtags from './Hashtags';

function PhotoPopup({ isOpen, photo, onClose, }) {
    console.log(photo.hashtags);
    return (
        <div className={`popup popup_type_photo ${isOpen && 'popup_is-opened'}`}>
            <div className="popup__wrapper">
                <img className="popup__image" src={photo.src} alt={photo.alt} />
                <div className="popup__caption">
                    <div className="popup__hashtags">
                        <button className="add-hashtag-btn"></button>
                        <Hashtags classname="hashtags hashtags_to-photo" photoHashtags={photo.hashtags} />
                    </div>
                    <div className="views">
                        <p className="views__number">{photo.views}</p>
                        <div className="views__icon" />
                    </div>
                </div>
                <button className="popup__close-btn" onClick={onClose}></button>
            </div>
        </div>
    );
}

export  default PhotoPopup;