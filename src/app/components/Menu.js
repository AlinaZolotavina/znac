import { useRef } from "react";
import CloseButton from "./CloseButton";
import LogoutButton from "./LogoutButton";
import { NavLink } from "react-router-dom";
import useInitialFocus from "../../shared/hooks/useInitialFocus";
import useFocusTrap from "../../shared/hooks/useFocusTrap";
import useReturnFocus from "../../shared/hooks/useReturnFocus";
import useCloseOnEsc from "../../shared/hooks/useCloseOnEsc";
import useOverlayClickClose from "../../shared/hooks/useOverlayClickClose";
import useLockBodyScroll from "../../shared/hooks/useLockBodyScroll";

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
  const menuRef = useRef(null);

  useReturnFocus(isOpen);
  useInitialFocus(isOpen, menuRef);
  useFocusTrap(isOpen, menuRef);
  useCloseOnEsc(isOpen, onClose);
  useLockBodyScroll(isOpen);

  const handleOverlayClickClose = useOverlayClickClose(isOpen, onClose);

  function handleGalleryClick() {
    onClose();
    onGalleryClick();
  }

  function handleContactClick() {
    onClose();
    onContactClick();
  }

  if (!isOpen) return null;

  return (
    <nav
      ref={menuRef}
      className="menu menu_visible"
      aria-label="Main navigation"
      tabIndex={-1}
      onMouseDown={handleOverlayClickClose}
    >
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
      <CloseButton
        classname="close-btn menu__close-btn"
        onClick={onClose}
        ariaLabel="Close menu"
      />
    </nav>
  );
}

export default Menu;
