import EditButton from './EditButton';
import Hashtags from './Hashtags';
import CloseButton from "./CloseButton";

function PhotoPopup({
    loggedIn,
    isOpen,
    photo,
    photoHashtags,
    views,
    onClose,
    onHashtagClick,
    areHashtagsEditing,
    onEditHashtags,
    isSendingReq,
    onEditHashtagsBtnClick,
    onPhotoFlip,
    isLeftFlipDisabled,
    isRightFlipDisabled,
    }) {
    function handleRightFlip() {
        onPhotoFlip(1);
    };

    function handleLeftFlip() {
        onPhotoFlip(-1);
    }

    return (
        <div className={`popup popup_type_photo ${isOpen && 'popup_is-opened'}`}>
            <div className="popup__wrapper">
                <div className='popup__photo-container'>
                    {!isLeftFlipDisabled && <button className='popup__left-flip' onClick={handleLeftFlip} disabled={isLeftFlipDisabled} />}
                    <img className="popup__image" src={photo.link} alt={photo.hashtags} />
                    {!isRightFlipDisabled && <button className='popup__right-flip' onClick={handleRightFlip} disabled={isRightFlipDisabled} />}
                </div>
                <div className="popup__caption">
                    <div className="popup__hashtags">
                        {loggedIn && <EditButton classname="edit-btn edit-hashtags-btn" onClick={onEditHashtagsBtnClick}/>}
                        <Hashtags
                            classname="hashtags hashtags_to-photo"
                            photoHashtags={photoHashtags || []}
                            onClick={onHashtagClick}
                            areHashtagsEditing={areHashtagsEditing}
                            onEditHashtags={onEditHashtags}
                            isSendingReq={isSendingReq}
                            photoId={photo._id}
                        />
                    </div>
                    <div className="views">
                        <p className="views__number">{views}</p>
                        <div className="views__icon" />
                    </div>
                </div>
                <CloseButton classname="close-btn popup__close-btn" onClick={onClose}/>
            </div>
        </div>
    );
}

export  default PhotoPopup;