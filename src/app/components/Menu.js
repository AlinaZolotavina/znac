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
        to="/"
        end
        onClick={onHomeClick}
        className={({ isActive }) =>
          isActive ? "menu__link menu__link_active" : "menu__link"
        }
      >
        HOME
      </NavLink>
      {loggedIn ? (
        <NavLink
          to="/profile"
          onClick={onProfileClick}
          className={({ isActive }) =>
            isActive ? "menu__link menu__link_active" : "menu__link"
          }
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
          to="/addphoto"
          onClick={onAddPhotoClick}
          className={({ isActive }) =>
            isActive ? "menu__link menu__link_active" : "menu__link"
          }
        >
          ADD PHOTO
        </NavLink>
      ) : (
        <button className="menu__link" onClick={handleContactClick}>
          CONTACT
        </button>
      )}
      <NavLink
        to="/alina"
        onClick={onBlogClick}
        className={({ isActive }) =>
          isActive ? "menu__link menu__link_active" : "menu__link"
        }
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
