import Hashtag from './Hashtag';

function Hashtags({
    photoHashtags,
    onClick,
    hashtagsNumber,
    }) {
    return (
        <>
            {photoHashtags
                    .slice(0, hashtagsNumber)
                    .map(photoHashtag => (
                    <Hashtag key={photoHashtag._id || photoHashtag} hashtag={photoHashtag.name || photoHashtag} onClick={onClick} />
                ))}
        </>
    );
}

export default Hashtags;