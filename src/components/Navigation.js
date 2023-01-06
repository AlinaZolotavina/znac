import { Link, useLocation } from 'react-router-dom';

function Navigation({ loggedIn, homeActive, onHomeClick, onGalleryClick, onContactClick }) {
    const location = useLocation();

    return (
        <div className='nav'>
            {
                location.pathname === '/' ?
                <button
                    className={`nav__link home-link ${homeActive}`}
                    onClick={onHomeClick}    
                >
                    HOME    
                </button>
                : <Link className="nav__link" to='/'>HOME </Link>
            }
            {
                location.pathname === '/' && <button 
                    className={`nav__link main-link`}
                    onClick={onGalleryClick}
                >
                    GALLERY
                </button>
            }
            {
                location.pathname === '/' && <button
                    className={`nav__link footer-link`}
                    onClick={onContactClick}
                >
                    CONTACT
                </button>
            }            
            {
                loggedIn &&
                    <Link
                        className={`nav__link ${location.pathname === '/profile' && 'nav__link_active'}`}
                        to='/profile'
                    >
                        PROFILE
                    </Link>
            }
            {  
                loggedIn && 
                    <Link
                        className={`nav__link ${location.pathname === '/addphoto' && 'nav__link_active'}`}
                        to='/addphoto'
                    >   
                        ADD PHOTO
                    </Link>
            }
        </div>
    );
}

export default Navigation;