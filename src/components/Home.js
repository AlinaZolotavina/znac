import Header from './Header';
import BurgerMenuBtn from './BurgerMenuBtn';
import Navigation from './Navigation';
import LogoutButton from './LogoutButton';
import Promo from './Promo';

function Home({
    loggedIn,
    homeActive,
    onHomeClick,
    onGalleryClick,
    onContactClick,
    onMenuClick,
    email,
    onLogout
    }) {
    return (
        <section className="home section" id='home'>
            <Header className='header'>
                <Navigation
                    loggedIn={loggedIn}
                    homeActive={homeActive}
                    onHomeClick={onHomeClick}
                    onGalleryClick={onGalleryClick}
                    onContactClick={onContactClick}
                />
                {loggedIn && <LogoutButton
                    className='logout-btn'
                    email={email}
                    onLogout={onLogout}
                />}  
            </Header>
            <BurgerMenuBtn onMenuClick={onMenuClick} /> 
            <Promo />
        </section>
    );
}

export default Home;