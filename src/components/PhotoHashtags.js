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
    const hashtagsToEdit = photoHashtags.join(' ');
    return (
        <section className={classname}>
            {areHashtagsEditing ?
                <EditingHashtags
                    editingHashtags={hashtagsToEdit}
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