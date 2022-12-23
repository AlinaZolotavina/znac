import Header from './Header';
import BurgerMenuBtn from './BurgerMenuBtn';
import Navigation from './Navigation';
import LogoutButton from './LogoutButton';
import Promo from './Promo';

function Home({ loggedIn, onHomeClick, onGalleryClick, onContactClick, onMenuClick, onLogout }) {
    return (
        <section className="home section" id='home'>
            <Header className='header'>
                <Navigation
                    loggedIn={loggedIn}
                    onHomeClick={onHomeClick}
                    onGalleryClick={onGalleryClick}
                    onContactClick={onContactClick}
                />
                {loggedIn && <LogoutButton className='logout-btn' onLogout={onLogout} />}  
            </Header>
            <BurgerMenuBtn onMenuClick={onMenuClick} /> 
            <Promo />
        </section>
    );
}

export default Home;