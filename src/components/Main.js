import Navigation from './Navigation';
import LogoutButton from './LogoutButton';
import Search from './Search';
import MainPageHashtags from './MainPageHashtags';
import Gallery from './Gallery';
import More from './More';

// import photosList from '../utils/photosList';
// import photoHashtags from '../utils/photoHashtags';

function Main({
    photos,
    loggedIn,
    homeActive,
    onHomeClick,
    onGalleryClick,
    onContactClick,
    onPhotoClick,
    onDeleteBtnClick,
    onHashtagClick,
    hashtag,
    photoHashtags,
    hashtagSetter,
    onSearch,
    photosQuantity,
    onShowMore,
    email,
    onLogout,
    isSendingReq,
    isSearching,
    }) {
    return (
        <main className="main section" id="main">
            <div className='main__navigation main__navigation_fixed'>
                <Navigation
                    loggedIn={loggedIn}
                    homeActive={homeActive}
                    onHomeClick={onHomeClick}
                    onGalleryClick={onGalleryClick}
                    onContactClick={onContactClick}
                />
                {loggedIn &&<LogoutButton
                    className='logout-btn'
                    email={email}
                    onLogout={onLogout}
                />}
            </div>
            <Search onSubmit={onSearch} isLoading={isSendingReq} hashtag={hashtag} hashtagSetter={hashtagSetter}/>
            <MainPageHashtags
                photoHashtags={photoHashtags}
                onClick={onHashtagClick}
            />
            <Gallery
                loggedIn={loggedIn}
                photos={photos}
                onDeleteBtnClick={onDeleteBtnClick}
                onPhotoClick={onPhotoClick}
                photosQuantity={photosQuantity}
                isSearching={isSearching}
            />
            {photos.length > photosQuantity ? (
                <More onShowMore={onShowMore}/>
            ) : ('')}
        </main>
    );
}

export default Main;