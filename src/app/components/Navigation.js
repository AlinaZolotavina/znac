import { Link } from "react-router-dom";
import { gallerySubnavigation } from "./MainNav";

function Navigation({
  loggedIn,
  onExploreClick,
  onGalleryClick,
  onContactClick,
}) {
  const clickHandlers = {
    explore: onExploreClick,
    photos: onGalleryClick,
    contact: onContactClick,
  };

  return (
    <nav className="nav" aria-label="Gallery navigation">
      {gallerySubnavigation
        .filter((item) => !item.private || loggedIn)
        .map((item) => {
          const className =
            item.id === "photos" ? "nav__link nav__link_active" : "nav__link";

          if (item.to) {
            return (
              <Link className={className} key={item.id} to={item.to}>
                {item.label.toUpperCase()}
              </Link>
            );
          }

          return (
            <button
              className={className}
              key={item.id}
              type="button"
              onClick={clickHandlers[item.id]}
            >
              {item.label.toUpperCase()}
            </button>
          );
        })}
    </nav>
  );
}

export default Navigation;
