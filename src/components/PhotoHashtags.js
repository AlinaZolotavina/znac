import EditingHashtags from './EditingHashtags';
import Hashtags from './Hashtags';

function PhotoHashtags({ 
    classname,
    photoHashtags,
    onClick,
    areHashtagsEditing,
    onEditHashtags,
    isSendingReq,
    photoId,
    }) {
    return (
        <section className={classname}>
            {areHashtagsEditing ?
                <EditingHashtags
                    editingHashtags={photoHashtags}
                    onSubmit={onEditHashtags}
                    isSendingReq={isSendingReq}
                    photoId={photoId}    
                />
                : <Hashtags
                    photoHashtags={photoHashtags}
                    hashtagsNumber={photoHashtags.length}
                    onClick={onClick}
                />
            }
        </section>
    )
};

export default PhotoHashtags;