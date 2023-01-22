import Hashtags from './Hashtags';

function MainPageHashtags({ photoHashtags, onClick }) {
    return (
        <section className='hashtags'>
            <p className='hashtags__caption'>Recently searched:</p>
            <Hashtags
                photoHashtags={photoHashtags}
                hashtagsNumber={10}
                onClick={onClick}
            />
        </section>
    )
};

export default MainPageHashtags;