import CloseButton from "./CloseButton";
import LogoutButton from "./LogoutButton";
import { NavLink } from "react-router-dom";

function Menu({
  isOpen,
  loggedIn,
  onHomeClick,
  onProfileClick,
  onAddPhotoClick,
  onGalleryClick,
  onBlogClick,
  onContactClick,
  onClose,
  onLogout,
}) {
  function handleGalleryClick() {
    onClose();
    onGalleryClick();
  }

  function handleContactClick() {
    onClose();
    onContactClick();
  }

  return (
    <div className={`menu ${isOpen && "menu_visible"}`}>
      <NavLink
        exact
        className="menu__link"
        activeClassName="menu__link_active"
        to="/"
        onClick={onHomeClick}
      >
        HOME
      </NavLink>
      {loggedIn ? (
        <NavLink
          className="menu__link"
          activeClassName="menu__link_active"
          to="/profile"
          onClick={onProfileClick}
        >
          PROFILE
        </NavLink>
      ) : (
        <button className="menu__link" onClick={handleGalleryClick}>
          GALLERY
        </button>
      )}
      {loggedIn ? (
        <NavLink
          className="menu__link"
          activeClassName="menu__link_active"
          to="/addphoto"
          onClick={onAddPhotoClick}
        >
          ADD PHOTO
        </NavLink>
      ) : (
        <button className="menu__link" onClick={handleContactClick}>
          CONTACT
        </button>
      )}
      <NavLink
        className="menu__link"
        activeClassName="menu__link_active"
        to="/alina"
        onClick={onBlogClick}
      >
        BLOG
      </NavLink>
      {loggedIn && (
        <LogoutButton
          className="logout-btn logout-btn_position_burger-menu"
          onLogout={onLogout}
        />
      )}
      <CloseButton classname="close-btn menu__close-btn" onClick={onClose} />
    </div>
  );
}

export default Menu;
