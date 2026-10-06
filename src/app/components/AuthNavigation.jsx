import Header from "./Header";
import MainNav from "./MainNav";

function AuthNavigation({
  loggedIn,
  onLogout,
  onMenuClick,
  isMenuOpen,
  menuId,
  onContactClick,
}) {
  return (
    <Header className="header header_type_main-nav">
      <MainNav
        activeSection="auth"
        loggedIn={loggedIn}
        onLogout={onLogout}
        onMenuClick={onMenuClick}
        isMenuOpen={isMenuOpen}
        menuId={menuId}
        onContactClick={onContactClick}
      />
    </Header>
  );
}

export default AuthNavigation;
