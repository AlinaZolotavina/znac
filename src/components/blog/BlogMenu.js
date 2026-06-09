import CloseButton from "../CloseButton";
import { NavLink } from "react-router-dom";

function BlogMenu({
  isOpen,
  activeBlogPage,
  onHomeClick,
  onPostsClick,
  onProjectsClick,
  onAboutClick,
  onClose,
}) {
  function handlePhotosClick() {
    onClose();
  }
  return (
    <div className={`blog-menu ${isOpen && "blog-menu_visible"}`}>
      <NavLink
        exact
        className="blog-menu__link"
        activeClassName="blog-menu__link_active"
        to="/alina"
        onClick={onHomeClick}
      >
        Home
      </NavLink>

      <NavLink
        className="blog-menu__link"
        activeClassName="blog-menu__link_active"
        to="/alina/posts"
        onClick={onPostsClick}
      >
        Posts
      </NavLink>

      <NavLink
        className="blog-menu__link"
        activeClassName="blog-menu__link_active"
        to="/alina/projects"
        onClick={onProjectsClick}
      >
        Projects
      </NavLink>

      <NavLink
        exact
        className="blog-menu__link"
        activeClassName="blog-menu__link_active"
        to="/"
        onClick={handlePhotosClick}
      >
        Photos
      </NavLink>

      <NavLink
        exact
        className="blog-menu__link"
        activeClassName="blog-menu__link_active"
        to="/alina/about"
        onClick={onAboutClick}
      >
        About
      </NavLink>

      <CloseButton
        classname="close-btn blog-menu__close-btn"
        onClick={onClose}
      />
    </div>
  );
}

export default BlogMenu;
