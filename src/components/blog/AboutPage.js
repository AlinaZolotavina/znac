import BlogHeader from "./BlogHeader";
import BlogPromo from "./BlogPromo";
import Skills from "./Skills";
import Projects from "./Projects";
import CVs from "./CVs.js";
import BlogFooter from "./BlogFooter";
import GamesAndMusic from "./GamesAndMusic.js";

function AboutPage({
  loggedIn,
  activePage,
  projectsToRender,
  onBlogMenuClick,
  onHomeClick,
  onPostsClick,
  onProjectsClick,
  onAboutClick,
  onContactClick,
  onAddProjectClick,
  onGamesClick,
  onMusicClick,
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
      <Skills />
      <Projects
        loggedIn={loggedIn}
        projects={projectsToRender}
        pathname="/alina/projects"
        projectsNumber={2}
        containerClassname="about-page"
        onAddProjectClick={onAddProjectClick}
      />
      <CVs />
      <GamesAndMusic onGamesClick={onGamesClick} onMusicClick={onMusicClick} />
      <BlogFooter />
    </div>
  );
}

export default AboutPage;
