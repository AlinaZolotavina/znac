import { NavLink, useLocation } from "react-router-dom";

function Navigation({
  loggedIn,
  onHomeClick,
  onBlogClick,
  onGalleryClick,
  onContactClick,
}) {
  const location = useLocation();

  return (
    <div className="nav">
      <NavLink
        to="/"
        end
        onClick={onHomeClick}
        className={({ isActive }) =>
          isActive ? "nav__link nav__link_active" : "nav__link"
        }
      >
        HOME
      </NavLink>
      {location.pathname === "/" && (
        <button className="nav__link" onClick={onGalleryClick}>
          GALLERY
        </button>
      )}
      <NavLink
        to="/alina"
        onClick={onBlogClick}
        className={({ isActive }) =>
          isActive ? "nav__link nav__link_active" : "nav__link"
        }
      >
        BLOG
      </NavLink>
      {location.pathname === "/" && (
        <button className="nav__link" onClick={onContactClick}>
          CONTACT
        </button>
      )}
      {loggedIn && (
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "nav__link nav__link_active" : "nav__link"
          }
        >
          PROFILE
        </NavLink>
      )}
      {loggedIn && (
        <NavLink
          to="/addphoto"
          className={({ isActive }) =>
            isActive ? "nav__link nav__link_active" : "nav__link"
          }
        >
          ADD PHOTO
        </NavLink>
      )}
    </div>
  );
}

export default Navigation;
