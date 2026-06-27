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
        exact
        className="nav__link"
        activeClassName="nav__link_active"
        to="/"
        onClick={onHomeClick}
      >
        HOME
      </NavLink>
      {location.pathname === "/" && (
        <button className="nav__link" onClick={onGalleryClick}>
          GALLERY
        </button>
      )}
      {location.pathname === "/" && (
        <NavLink
          className="nav__link"
          activeClassName="nav__link_active"
          to="/alina"
          onClick={onBlogClick}
        >
          BLOG
        </NavLink>
      )}
      {location.pathname === "/" && (
        <button className="nav__link" onClick={onContactClick}>
          CONTACT
        </button>
      )}
      {loggedIn && (
        <NavLink
          className="nav__link"
          activeClassName="nav__link_active"
          to="/profile"
        >
          PROFILE
        </NavLink>
      )}
      {loggedIn && (
        <NavLink
          className={`nav__link ${location.pathname === "/addphoto" && "nav__link_active"}`}
          to="/addphoto"
        >
          ADD PHOTO
        </NavLink>
      )}
    </div>
  );
}

export default Navigation;
