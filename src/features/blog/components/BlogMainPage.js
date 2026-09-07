import BlogHeader from "./BlogHeader";
import BlogPromo from "./BlogPromo";
import LatestPosts from "./LatestPosts";
import Projects from "./Projects";
import BlogFooter from "./BlogFooter";

function BlogMainPage({
  loggedIn,
  currentUser,
  onLogout,
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
  isPostsLoading,
  isProjectsLoading,
}) {
  return (
    <div className="blog">
      <BlogHeader
        loggedIn={loggedIn}
        currentUser={currentUser}
        onLogout={onLogout}
        activePage={activePage}
        onBlogMenuClick={onBlogMenuClick}
        onHomeClick={onHomeClick}
        onPostsClick={onPostsClick}
        onProjectsClick={onProjectsClick}
        onAboutClick={onAboutClick}
        onContactClick={onContactClick}
      />
      <main>
        <BlogPromo />
        <LatestPosts
          loggedIn={loggedIn}
          posts={postsToRender}
          postsQuantity={4}
          isThereMoreContent={totalPosts > 4}
          onPostClick={onPostClick}
          onEditPostButtonClick={onEditPostButtonClick}
          onDeletePostButtonClick={onDeletePostButtonClick}
          onAddPostClick={onNewPostClick}
          onViewAllClick={onViewAllPostsClick}
          isLoading={isPostsLoading}
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
          isLoading={isProjectsLoading}
        />
      </main>
      <BlogFooter />
    </div>
  );
}

export default BlogMainPage;
