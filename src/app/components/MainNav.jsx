import { Link } from "react-router-dom";
import LogoutBtn from "./LogoutBtn";

export const gallerySubnavigation = [
  { id: "explore", label: "Explore", href: "/gallery#home" },
  { id: "photos", label: "Photos", href: "/gallery#main" },
  { id: "contact", label: "Contact", href: "/gallery#footer" },
  { id: "profile", label: "Profile", to: "/profile", private: true },
  {
    id: "add-photo",
    label: "Add photo",
    to: "/gallery/addphoto",
    private: true,
  },
];

export const blogSubnavigation = [
  { id: "overview", label: "Overview", to: "/journal" },
  { id: "posts", label: "Posts", to: "/journal/posts" },
  { id: "projects", label: "Projects", to: "/journal/projects" },
  { id: "about", label: "About", to: "/journal/about" },
];

const subnavigation = {
  main: [],
  photos: gallerySubnavigation,
  blog: blogSubnavigation,
};

function MainNav({
  activeSection,
  activeSubsection,
  loggedIn,
  onLogout,
  onMenuClick,
  onSubsectionClick,
  actionSlot,
  menuAriaLabel = "Open main menu",
}) {
  const items = subnavigation[activeSection] || [];
  const themeClass = activeSection === "blog" ? " main-nav_theme_blog" : "";
  const logoutTheme = activeSection === "blog" ? "blog" : "main";
  const currentSubsection =
    activeSubsection || (activeSection === "photos" ? "photos" : "overview");
  const actionSlotClassName = actionSlot
    ? "main-nav__actions main-nav__actions_has-action-slot"
    : "main-nav__actions main-nav__actions_without-action-slot";
  const primaryRowClassName = actionSlot
    ? "main-nav__primary-row main-nav__primary-row_has-action-slot"
    : "main-nav__primary-row main-nav__primary-row_without-action-slot";

  function handleSubsectionClick(item, event) {
    onSubsectionClick?.(item.id, event);
  }

  function getPrimaryClassName(section) {
    return section === activeSection
      ? "main-nav__link main-nav__link_active"
      : "main-nav__link";
  }

  function getSecondaryClassName(item) {
    return item.id === currentSubsection
      ? "main-nav__secondary-link main-nav__secondary-link_active"
      : "main-nav__secondary-link";
  }

  return (
    <div className={`main-nav${themeClass}`}>
      <div className={primaryRowClassName}>
        <Link className="main-nav__brand" to="/">
          ZNAC
        </Link>
        <nav className="main-nav__primary" aria-label="Primary navigation">
          <Link className={getPrimaryClassName("main")} to="/">
            Home
          </Link>
          <Link className={getPrimaryClassName("photos")} to="/gallery">
            Gallery
          </Link>
          <Link className={getPrimaryClassName("blog")} to="/journal">
            Journal
          </Link>
        </nav>
        <div className={actionSlotClassName}>
          {actionSlot}
          {loggedIn && (
            <LogoutBtn
              className="main-nav__logout"
              onLogout={onLogout}
              theme={logoutTheme}
            />
          )}
        </div>
        <button
          className="main-nav__menu-btn"
          type="button"
          onClick={onMenuClick}
          aria-label={menuAriaLabel}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {items.length > 0 && (
        <nav
          className="main-nav__secondary"
          aria-label={`${activeSection} navigation`}
        >
          {items
            .filter((item) => !item.private || loggedIn)
            .map((item) => {
              const className = getSecondaryClassName(item);

              if (item.to) {
                return (
                  <Link
                    className={className}
                    key={item.id}
                    to={item.to}
                    onClick={(event) => handleSubsectionClick(item, event)}
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <a
                  className={className}
                  key={item.id}
                  href={item.href}
                  onClick={(event) => handleSubsectionClick(item, event)}
                >
                  {item.label}
                </a>
              );
            })}
        </nav>
      )}
    </div>
  );
}

export default MainNav;
