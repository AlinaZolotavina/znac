import BlogHeader from "./BlogHeader";
import BlogPromo from "./BlogPromo";
import LatestPosts from "./LatestPosts";
import Projects from "./Projects";
import BlogFooter from "./BlogFooter";

function BlogMainPage({
  loggedIn,
  activePage,
  postsToRender,
  totalPosts,
  projectsToRender,
  totalProjects,
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
        isThereMoreContent={totalPosts > 3}
        onPostClick={onPostClick}
        onEditPostButtonClick={onEditPostButtonClick}
        onDeletePostButtonClick={onDeletePostButtonClick}
        onAddPostClick={onNewPostClick}
        onViewAllClick={onViewAllPostsClick}
      />
      <Projects
        loggedIn={loggedIn}
        projects={projectsToRender}
        isThereMoreContent={totalProjects}
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
