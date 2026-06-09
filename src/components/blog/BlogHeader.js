import ContactButton from "./ContactButton";
import { NavLink } from "react-router-dom";

function BlogHeader({
  onContactClick,
  onBlogMenuClick,
  onHomeClick,
  onPostsClick,
  onProjectsClick,
  onAboutClick,
}) {
  return (
    <div className="blog-header">
      <div className="blog-header__links">
        <NavLink
          exact
          className="blog-header__link"
          activeClassName="blog-header__link_state_active"
          to="/alina"
          onClick={onHomeClick}
        >
          Home
        </NavLink>

        <NavLink
          className="blog-header__link"
          activeClassName="blog-header__link_state_active"
          to="/alina/posts"
          onClick={onPostsClick}
        >
          Posts
        </NavLink>

        <NavLink
          className="blog-header__link"
          activeClassName="blog-header__link_state_active"
          to="/alina/projects"
          onClick={onProjectsClick}
        >
          Projects
        </NavLink>

        <NavLink
          exact
          className="blog-header__link"
          activeClassName="blog-header__link_state_active"
          to="/"
        >
          Photos
        </NavLink>

        <NavLink
          className="blog-header__link"
          activeClassName="blog-header__link_state_active"
          to="/alina/about"
          onClick={onAboutClick}
        >
          About
        </NavLink>
      </div>
      <button className="blog-burger-menu" onClick={onBlogMenuClick} />
      <ContactButton onClick={onContactClick} />
    </div>
  );
}

export default BlogHeader;
