import Hashtag from "./Hashtag";

function Hashtags({ classname, photoHashtags, onClick }) {
    const hashtags = photoHashtags.toString().split(' ');
    return (
        <section className={classname}>
            {hashtags.map(photoHashtag => (
                <Hashtag key={photoHashtag} hashtag={photoHashtag} onClick={onClick} />
            ))}
        </section>
    );
}

export default Hashtags;