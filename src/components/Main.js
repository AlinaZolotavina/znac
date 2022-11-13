import Navigation from './Navigation';
import LogoutButton from './LogoutButton';
import Search from './Search';
import Hashtags from './Hashtags';
import Gallery from './Gallery';
import More from './More';

import photosList from '../utils/photosList';
import photoHashtags from '../utils/photoHashtags';

function Main({ loggedIn, onHomeClick, onGalleryClick, onContactClick, onPhotoClick, onDeleteBtnClick }) {
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
            <Search />
            <Hashtags classname="hashtags" photoHashtags={photoHashtags} />
            <Gallery
                loggedIn={loggedIn}
                photos={photosList}
                onDeleteBtnClick={onDeleteBtnClick}
                onPhotoClick={onPhotoClick}
            />
            <More />
        </main>
    );
}

export default Main;