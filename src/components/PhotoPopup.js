import EditButton from './EditButton';
import PhotoHashtags from './PhotoHashtags';
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
    const hashtags = photoHashtags.toString().split(' ');
    function handleRightFlip() {
        onPhotoFlip('right');
    };

    function handleLeftFlip() {
        onPhotoFlip('left');
    }

    return (
        <div className={`popup popup_type_photo ${isOpen && 'popup_is-opened'}`}>
            <div className="popup__wrapper">
                <div className='popup__photo-container'>
                    <button className={`popup__left-flip flip-btn ${isLeftFlipDisabled && 'flip-btn_hidden'}`} onClick={handleLeftFlip} disabled={isLeftFlipDisabled} />
                    <div className='popup__photo'>
                        <img className="popup__image" src={photo.link} alt={photo.hashtags} />
                        <CloseButton classname="close-btn popup__close-btn" onClick={onClose}/>
                    </div>
                    <button className={`popup__right-flip flip-btn ${isRightFlipDisabled && 'flip-btn_hidden'}`} onClick={handleRightFlip} disabled={isRightFlipDisabled} />
                    <div className="popup__caption">
                        <div className="popup__hashtags">
                            {loggedIn && <EditButton classname="edit-btn edit-hashtags-btn" onClick={onEditHashtagsBtnClick}/>}
                            <PhotoHashtags
                                classname="hashtags hashtags_to-photo"
                                photoHashtags={hashtags || []}
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
                </div>
            </div>
        </div>
    );
}

export  default PhotoPopup;