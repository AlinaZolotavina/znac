import CloseButton from "../../../app/components/CloseButton";
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

      <CloseButton
        classname="close-btn blog-menu__close-btn"
        onClick={onClose}
      />
    </div>
  );
}

export default BlogMenu;
