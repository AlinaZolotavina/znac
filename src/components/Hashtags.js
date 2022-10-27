import Hashtag from "./Hashtag";

function Hashtags({ classname, photoHashtags }) {
    return (
        <section className={classname}>
            {photoHashtags.map(photoHashtag => (
                <Hashtag key={photoHashtag} hashtag={photoHashtag} />
            ))}
        </section>
    );
}

export default Hashtags;