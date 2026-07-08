import BlogHeader from "./BlogHeader";
import BlogPromo from "./BlogPromo";
import LatestPosts from "./LatestPosts";
import Projects from "./Projects";
import BlogFooter from "./BlogFooter";

function BlogMainPage({
  loggedIn,
  activePage,
  postsToRender,
  projectsToRender,
  projectsQuantity,
  onBlogMenuClick,
  onHomeClick,
  onPostsClick,
  onProjectsClick,
  onAboutClick,
  onContactClick,
  onNewPostClick,
  onNewProjectClick,
  onViewAllPostsClick,
  onViewAllProjectsClick,
  onPostClick,
  onEditPostButtonClick,
  onDeletePostButtonClick,
  onEditProjectButtonClick,
  onDeleteProjectButtonClick,
}) {
  return (
    <div className="blog">
      <BlogHeader
        activePage={activePage}
        onBlogMenuClick={onBlogMenuClick}
        onHomeClick={onHomeClick}
        onPostsClick={onPostsClick}
        onProjectsClick={onProjectsClick}
        onAboutClick={onAboutClick}
        onContactClick={onContactClick}
      />
      <BlogPromo />
      <LatestPosts
        loggedIn={loggedIn}
        posts={postsToRender}
        onPostClick={onPostClick}
        onEditPostButtonClick={onEditPostButtonClick}
        onDeletePostButtonClick={onDeletePostButtonClick}
        onAddPostClick={onNewPostClick}
        onViewAllClick={onViewAllPostsClick}
      />
      <Projects
        loggedIn={loggedIn}
        projects={projectsToRender}
        onViewAllClick={onViewAllProjectsClick}
        projectsNumber={projectsQuantity}
        containerClassname="main-page"
        onAddProjectClick={onNewProjectClick}
        onEditProjectButtonClick={onEditProjectButtonClick}
        onDeleteProjectButtonClick={onDeleteProjectButtonClick}
      />
      <BlogFooter />
    </div>
  );
}

export default BlogMainPage;
