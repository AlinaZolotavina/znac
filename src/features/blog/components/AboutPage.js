import BlogHeader from "./BlogHeader";
import BlogPromo from "./BlogPromo";
import Skills from "./Skills";
import Projects from "./Projects";
import CVs from "./CVs.js";
import BlogFooter from "./BlogFooter";
import GamesAndMusic from "./GamesAndMusic.js";

function AboutPage({
  loggedIn,
  projectsToRender,
  totalProjects,
  onBlogMenuClick,
  onContactClick,
  onAddProjectClick,
  onGamesClick,
  onMusicClick,
  onHomeClick,
  onPostsClick,
  onProjectsClick,
  onAboutClick,
  onViewAllProjectsClick,
  onEditProjectButtonClick,
  onDeleteProjectButtonClick,
}) {
  return (
    <div className="blog">
      <BlogHeader
        onBlogMenuClick={onBlogMenuClick}
        onContactClick={onContactClick}
        onHomeClick={onHomeClick}
        onPostsClick={onPostsClick}
        onProjectsClic={onProjectsClick}
        onAboutClick={onAboutClick}
      />
      <BlogPromo />
      <Skills />
      <Projects
        loggedIn={loggedIn}
        projects={projectsToRender}
        isThereMoreContent={totalProjects}
        onViewAllClick={onViewAllProjectsClick}
        projectsNumber={2}
        containerClassname="about-page"
        onAddProjectClick={onAddProjectClick}
        onEditProjectButtonClick={onEditProjectButtonClick}
        onDeleteProjectButtonClick={onDeleteProjectButtonClick}
      />
      <CVs />
      <GamesAndMusic onGamesClick={onGamesClick} onMusicClick={onMusicClick} />
      <BlogFooter />
    </div>
  );
}

export default AboutPage;
