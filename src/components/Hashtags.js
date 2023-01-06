import Hashtag from './Hashtag';
import EditingHashtags from './EditingHashtags';

function Hashtags({
    classname,
    photoHashtags,
    onClick,
    areHashtagsEditing,
    onEditHashtags,
    isSendingReq,
    photoId,
    }) {
    const hashtags = photoHashtags.toString().split(' ');
    return (
        <section className={classname}>
            {areHashtagsEditing ?
                <EditingHashtags
                    editingHashtags={photoHashtags}
                    onSubmit={onEditHashtags}
                    isSendingReq={isSendingReq}
                    photoId={photoId}    
                />
                : hashtags.map(photoHashtag => (
                    <Hashtag key={photoHashtag} hashtag={photoHashtag} onClick={onClick} />
                ))}
        </section>
    );
}

export default Hashtags;