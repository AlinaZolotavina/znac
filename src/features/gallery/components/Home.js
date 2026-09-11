import { forwardRef } from "react";
import Header from "../../../app/components/Header";
import MainNav from "../../../app/components/MainNav";
import ScrollHintMouse from "../../../app/components/ScrollHintMouse";
import Promo from "./Promo";

const Home = forwardRef(function Home(
  {
    loggedIn,
    onMenuClick,
    onLogout,
    onScrollHintClick,
    onSubsectionClick,
    isMenuOpen,
    menuId,
  },
  ref,
) {
  return (
    <section ref={ref} className="home section" id="home">
      <Header className="header header_type_main-nav">
        <MainNav
          activeSection="photos"
          activeSubsection="explore"
          loggedIn={loggedIn}
          onLogout={onLogout}
          onMenuClick={onMenuClick}
          onSubsectionClick={onSubsectionClick}
          isMenuOpen={isMenuOpen}
          menuId={menuId}
        />
      </Header>
      <Promo />
      <ScrollHintMouse
        onClick={onScrollHintClick}
        ariaLabel="Scroll to photos"
      />
    </section>
  );
});

export default Home;
