import Header from './Header';
import Navigation from './Navigation';
import Promo from './Promo';

function Home() {
    return (
        <section className="home">
            <Header className="header">
                <Navigation
                    className="nav"
                    firstLink='HOME'
                    secondLink='GALLERY'
                    thirdLink='CONTACT'
                />
            </Header>
            <Promo />
        </section>
    );
}

export default Home;