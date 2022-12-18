import Navigation from './Navigation';
import LogoutButton from './LogoutButton';
import Search from './Search';
import Hashtags from './Hashtags';
import Gallery from './Gallery';
import More from './More';

// import photosList from '../utils/photosList';
// import photoHashtags from '../utils/photoHashtags';

function Main({
    photos,
    loggedIn,
    onHomeClick,
    onGalleryClick,
    onContactClick,
    onPhotoClick,
    onDeleteBtnClick,
    onHashtagClick,
    hashtag,
    hashtagSetter,
    onSearch 
    }) {
    return (
        <main className="main section" id="main">
            <div className='main__navigation main__navigation_fixed'>
                <Navigation
                    loggedIn={loggedIn}
                    onHomeClick={onHomeClick}
                    onGalleryClick={onGalleryClick}
                    onContactClick={onContactClick}
                />
                {loggedIn && <LogoutButton className='logout-btn'/>}
            </div>
            <Search onSubmit={onSearch} hashtag={hashtag} hashtagSetter={hashtagSetter}/>
            <Hashtags
                classname="hashtags"
                photoHashtags='nature mountains sea Paris Switzerland Alps architecture'
                onClick={onHashtagClick}
            />
            <Gallery
                loggedIn={loggedIn}
                photos={photos}
                onDeleteBtnClick={onDeleteBtnClick}
                onPhotoClick={onPhotoClick}
            />
            <More />
        </main>
    );
}

export default Main;