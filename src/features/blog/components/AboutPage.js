import BlogHeader from "./BlogHeader";
import AboutHero from "./AboutHero";
import Skills from "./Skills";
import Projects from "./Projects";
import CVs from "./CVs.js";
import BlogFooter from "./BlogFooter";
import ReactPlayground from "./ReactPlayground.js";

function AboutPage({
  loggedIn,
  currentUser,
  onLogout,
  projectsToRender,
  totalProjects,
  onBlogMenuClick,
  onContactClick,
  onAddProjectClick,
  onHomeClick,
  onPostsClick,
  onProjectsClick,
  onAboutClick,
  onViewAllProjectsClick,
  onEditProjectButtonClick,
  onDeleteProjectButtonClick,
  projectsNumber,
}) {
  return (
    <div className="blog">
      <BlogHeader
        loggedIn={loggedIn}
        currentUser={currentUser}
        onLogout={onLogout}
        onBlogMenuClick={onBlogMenuClick}
        onContactClick={onContactClick}
        onHomeClick={onHomeClick}
        onPostsClick={onPostsClick}
        onProjectsClick={onProjectsClick}
        onAboutClick={onAboutClick}
      />
      <AboutHero />
      <Skills />
      <Projects
        loggedIn={loggedIn}
        projects={projectsToRender}
        isThereMoreContent={totalProjects}
        onViewAllClick={onViewAllProjectsClick}
        projectsNumber={projectsNumber}
        containerClassname="about-page"
        onAddProjectClick={onAddProjectClick}
        onEditProjectButtonClick={onEditProjectButtonClick}
        onDeleteProjectButtonClick={onDeleteProjectButtonClick}
      />
      <CVs />
      <ReactPlayground />
      <BlogFooter />
    </div>
  );
}

export default AboutPage;
