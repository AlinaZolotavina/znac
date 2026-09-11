import ContactButton from "./ContactButton";
import MainNav from "../../../app/components/MainNav";
import { useLocation } from "react-router-dom";

function BlogHeader({
  loggedIn,
  currentUser,
  onLogout,
  onContactClick,
  onBlogMenuClick,
  onHomeClick,
  onPostsClick,
  onProjectsClick,
  onAboutClick,
  isMenuOpen,
}) {
  const { pathname } = useLocation();

  function getActiveSubsection() {
    if (pathname.startsWith("/journal/posts")) return "posts";
    if (pathname.startsWith("/journal/projects")) return "projects";
    if (pathname.startsWith("/journal/about")) return "about";

    return "overview";
  }

  function handleSubsectionClick(id) {
    const callbacks = {
      overview: onHomeClick,
      posts: onPostsClick,
      projects: onProjectsClick,
      about: onAboutClick,
    };

    callbacks[id]?.();
  }

  return (
    <header className="blog-header">
      <MainNav
        activeSection="blog"
        activeSubsection={getActiveSubsection()}
        loggedIn={loggedIn}
        onLogout={() => onLogout(currentUser?.email)}
        onMenuClick={onBlogMenuClick}
        onSubsectionClick={handleSubsectionClick}
        actionSlot={<ContactButton onClick={onContactClick} />}
        menuAriaLabel="Open blog menu"
        isMenuOpen={isMenuOpen}
        menuId="blog-main-menu"
      />
    </header>
  );
}

export default BlogHeader;
