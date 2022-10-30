import Search from './Search';
import Hashtags from './Hashtags';
import Gallery from './Gallery';
import More from './More';

import photosList from '../utils/photosList';
import photoHashtags from '../utils/photoHashtags';
import Navigation from './Navigation';

function Main({ loggedIn, onPhotoClick }) {
    return (
        <main className="main" id="main">
            <Navigation
                className="nav nav_fixed"
                firstLink='HOME'
                secondLink='GALLERY'
                thirdLink='CONTACT'
            />
            <Search />
            <Hashtags classname="hashtags" photoHashtags={photoHashtags} />
            <Gallery loggedIn={loggedIn} photos={photosList} onPhotoClick={onPhotoClick} />
            <More />
        </main>
    );
}

export default Main;