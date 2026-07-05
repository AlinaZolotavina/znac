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
          to="/alina"
          end
          onClick={onHomeClick}
          className={({ isActive }) =>
            isActive
              ? "blog-header__link blog-header__link_state_active"
              : "blog-header__link"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/alina/posts"
          onClick={onPostsClick}
          className={({ isActive }) =>
            isActive
              ? "blog-header__link blog-header__link_state_active"
              : "blog-header__link"
          }
        >
          Posts
        </NavLink>

        <NavLink
          to="/alina/projects"
          onClick={onProjectsClick}
          className={({ isActive }) =>
            isActive
              ? "blog-header__link blog-header__link_state_active"
              : "blog-header__link"
          }
        >
          Projects
        </NavLink>

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "blog-header__link blog-header__link_state_active"
              : "blog-header__link"
          }
        >
          Photos
        </NavLink>

        <NavLink
          to="/alina/about"
          onClick={onAboutClick}
          className={({ isActive }) =>
            isActive
              ? "blog-header__link blog-header__link_state_active"
              : "blog-header__link"
          }
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
