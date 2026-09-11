import { useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import LogoutBtn from "./LogoutBtn";

import useCloseOnEsc from "../../shared/hooks/useCloseOnEsc";
import useFocusTrap from "../../shared/hooks/useFocusTrap";
import useInitialFocus from "../../shared/hooks/useInitialFocus";
import useLockBodyScroll from "../../shared/hooks/useLockBodyScroll";
import useOverlayClickClose from "../../shared/hooks/useOverlayClickClose";
import useReturnFocus from "../../shared/hooks/useReturnFocus";

function MainMenu({
  isOpen,
  loggedIn,
  onClose,
  onLogout,
  theme = "main",
  navigationLabel = "Main navigation",
}) {
  const menuRef = useRef(null);
  const { pathname, hash } = useLocation();

  useReturnFocus(isOpen);
  useInitialFocus(isOpen, menuRef);
  useFocusTrap(isOpen, menuRef);
  useCloseOnEsc(isOpen, onClose);
  useLockBodyScroll(isOpen);

  const handleOverlayClickClose = useOverlayClickClose(isOpen, onClose);
  const menuClassName = `main-menu main-menu_theme_${theme}`;
  const logoutTheme = theme === "blog" ? "blog" : "main";

  function getLinkClassName(isActive) {
    return isActive ? "main-menu__link main-menu__link_active" : "main-menu__link";
  }

  function getSubsectionClassName(isActive) {
    return isActive
      ? "main-menu__subsection-link main-menu__subsection-link_active"
      : "main-menu__subsection-link";
  }

  function isGallerySectionActive() {
    return pathname.startsWith("/gallery") || pathname.startsWith("/profile");
  }

  function isGallerySubsectionActive(id) {
    if (id === "explore") {
      return pathname === "/gallery" && (!hash || hash === "#home");
    }

    if (id === "photos") {
      return pathname === "/gallery" && hash === "#main";
    }

    if (id === "contact") {
      return pathname === "/gallery" && hash === "#footer";
    }

    if (id === "profile") {
      return pathname.startsWith("/profile");
    }

    return pathname.startsWith("/gallery/addphoto");
  }

  function getBlogSubsectionClassName({ isActive }) {
    return getSubsectionClassName(isActive);
  }

  if (!isOpen) {
    return null;
  }

  return (
    <nav
      className={menuClassName}
      ref={menuRef}
      aria-label={navigationLabel}
      tabIndex={-1}
      onMouseDown={handleOverlayClickClose}
    >
      <div className="main-menu__content">
        <button
          className="main-menu__close"
          type="button"
          onClick={onClose}
          aria-label="Close main menu"
        />
        <Link className="main-menu__brand" to="/" onClick={onClose}>
          ZNAK
        </Link>
        <ul className="main-menu__sections">
          <li className="main-menu__section">
            <Link
              className={getLinkClassName(pathname === "/")}
              to="/"
              onClick={onClose}
            >
              Home
            </Link>
          </li>
          <li className="main-menu__section">
            <Link
              className={getLinkClassName(isGallerySectionActive())}
              to="/gallery"
              onClick={onClose}
            >
              Gallery
            </Link>
            <ul className="main-menu__subsections">
              <li>
                <a
                  className={getSubsectionClassName(
                    isGallerySubsectionActive("explore"),
                  )}
                  href="/gallery#home"
                  onClick={onClose}
                >
                  Explore
                </a>
              </li>
              <li>
                <a
                  className={getSubsectionClassName(
                    isGallerySubsectionActive("photos"),
                  )}
                  href="/gallery#main"
                  onClick={onClose}
                >
                  Photos
                </a>
              </li>
              <li>
                <a
                  className={getSubsectionClassName(
                    isGallerySubsectionActive("contact"),
                  )}
                  href="/gallery#footer"
                  onClick={onClose}
                >
                  Contact
                </a>
              </li>
              {loggedIn && (
                <li>
                  <Link
                    className={getSubsectionClassName(
                      isGallerySubsectionActive("profile"),
                    )}
                    to="/profile"
                    onClick={onClose}
                  >
                    Profile
                  </Link>
                </li>
              )}
              {loggedIn && (
                <li>
                  <Link
                    className={getSubsectionClassName(
                      isGallerySubsectionActive("add-photo"),
                    )}
                    to="/gallery/addphoto"
                    onClick={onClose}
                  >
                    Add photo
                  </Link>
                </li>
              )}
            </ul>
          </li>
          <li className="main-menu__section">
            <Link
              className={getLinkClassName(pathname.startsWith("/journal"))}
              to="/journal"
              onClick={onClose}
            >
              Journal
            </Link>
            <ul className="main-menu__subsections">
              <li>
                <NavLink
                  className={getBlogSubsectionClassName}
                  end
                  to="/journal"
                  onClick={onClose}
                >
                  Overview
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={getBlogSubsectionClassName}
                  to="/journal/posts"
                  onClick={onClose}
                >
                  Posts
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={getBlogSubsectionClassName}
                  to="/journal/projects"
                  onClick={onClose}
                >
                  Projects
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={getBlogSubsectionClassName}
                  to="/journal/about"
                  onClick={onClose}
                >
                  About
                </NavLink>
              </li>
            </ul>
          </li>
        </ul>
        {loggedIn && (
          <LogoutBtn
            className="main-menu__logout"
            onLogout={onLogout}
            theme={logoutTheme}
          />
        )}
      </div>
    </nav>
  );
}

export default MainMenu;
