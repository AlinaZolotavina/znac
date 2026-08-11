import { useRef } from "react";
import CloseButton from "../../../app/components/CloseButton";
import LogoutButton from "../../../app/components/LogoutButton";
import { NavLink } from "react-router-dom";
import useInitialFocus from "../../../shared/hooks/useInitialFocus";
import useFocusTrap from "../../../shared/hooks/useFocusTrap";
import useReturnFocus from "../../../shared/hooks/useReturnFocus";
import useCloseOnEsc from "../../../shared/hooks/useCloseOnEsc";
import useOverlayClickClose from "../../../shared/hooks/useOverlayClickClose";
import useLockBodyScroll from "../../../shared/hooks/useLockBodyScroll";

function BlogMenu({
  isOpen,
  activeBlogPage,
  loggedIn,
  currentUser,
  onLogout,
  onHomeClick,
  onPostsClick,
  onProjectsClick,
  onAboutClick,
  onClose,
}) {
  const menuRef = useRef(null);

  useReturnFocus(isOpen);
  useInitialFocus(isOpen, menuRef);
  useFocusTrap(isOpen, menuRef);
  useCloseOnEsc(isOpen, onClose);
  useLockBodyScroll(isOpen);

  const handleOverlayClickClose = useOverlayClickClose(isOpen, onClose);

  function handlePhotosClick() {
    onClose();
  }

  function handleLogout(email) {
    onLogout(email);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <nav
      ref={menuRef}
      className="blog-menu blog-menu_visible"
      aria-label="Blog navigation"
      tabIndex={-1}
      onMouseDown={handleOverlayClickClose}
    >
      <NavLink
        to="/alina"
        end
        onClick={onHomeClick}
        className={({ isActive }) =>
          isActive
            ? "blog-menu__link blog-menu__link_active"
            : "blog-menu__link"
        }
      >
        Home
      </NavLink>

      <NavLink
        to="/alina/posts"
        onClick={onPostsClick}
        className={({ isActive }) =>
          isActive
            ? "blog-menu__link blog-menu__link_active"
            : "blog-menu__link"
        }
      >
        Posts
      </NavLink>

      <NavLink
        to="/alina/projects"
        onClick={onProjectsClick}
        className={({ isActive }) =>
          isActive
            ? "blog-menu__link blog-menu__link_active"
            : "blog-menu__link"
        }
      >
        Projects
      </NavLink>

      <NavLink
        to="/"
        onClick={handlePhotosClick}
        className={({ isActive }) =>
          isActive
            ? "blog-menu__link blog-menu__link_active"
            : "blog-menu__link"
        }
      >
        Photos
      </NavLink>

      <NavLink
        to="/alina/about"
        onClick={onAboutClick}
        className={({ isActive }) =>
          isActive
            ? "blog-menu__link blog-menu__link_active"
            : "blog-menu__link"
        }
      >
        About
      </NavLink>

      {loggedIn && (
        <LogoutButton
          className="blog-logout-btn blog-logout-btn_location_menu"
          email={currentUser?.email}
          onLogout={handleLogout}
        />
      )}

      <CloseButton
        classname="close-btn blog-menu__close-btn"
        onClick={onClose}
        ariaLabel="Close menu"
      />
    </nav>
  );
}

export default BlogMenu;
