import Header from './Header';
import Navigation from './Navigation';
import LogoutButton from './LogoutButton';
import Promo from './Promo';

function Home({ loggedIn }) {
    return (
        <section className="home">
            <Header className={`header ${loggedIn ? 'admin-header' : ''}`}>
                {
                loggedIn ? (
                    <>
                        <Navigation
                            className="nav"
                            firstLink='HOME'
                            secondLink='PROFILE'
                            thirdLink='ADD PHOTO'
                        />
                        <LogoutButton />
                    </>
                ) : (
                    <Navigation
                        className="nav"
                        firstLink='HOME'
                        secondLink='GALLERY'
                        thirdLink='CONTACT'
                    />
                    )
                }                
            </Header>
            <Promo />
        </section>
    );
}

export default Home;