import { forwardRef } from "react";
import Header from "./Header";
import BurgerMenuBtn from "./BurgerMenuBtn";
import Navigation from "./Navigation";
import LogoutButton from "./LogoutButton";
import Promo from "./Promo";

const Home = forwardRef(function Home(
  {
    loggedIn,
    homeActive,
    onHomeClick,
    onBlogClick,
    onGalleryClick,
    onContactClick,
    onMenuClick,
    email,
    onLogout,
  },
  ref,
) {
  return (
    <section ref={ref} className="home section" id="home">
      <Header className="header">
        <Navigation
          loggedIn={loggedIn}
          onHomeClick={onHomeClick}
          onBlogClick={onBlogClick}
          onGalleryClick={onGalleryClick}
          onContactClick={onContactClick}
        />
        {loggedIn && (
          <LogoutButton
            className="logout-btn logout-btn_position_nav"
            email={email}
            onLogout={onLogout}
          />
        )}
      </Header>
      <BurgerMenuBtn onMenuClick={onMenuClick} />
      <Promo />
    </section>
  );
});

export default Home;
