import { useEffect, useState } from "react";
import BlogHeader from "./BlogHeader";
import ProjectsHero from "./ProjectsHero.js";
import ProjectHashtags from "./ProjectHashtags.js";
import ProjectsContainer from "./ProjectsContainer";
import ProjectDetailsPopup from "./ProjectDetailsPopup.js";
import BlogFooter from "./BlogFooter";
import ShowMoreButton from "./ShowMoreButton.js";
import ContentNotFound from "./ContentNotFound.js";

function ProjectsPage({
  loggedIn,
  currentUser,
  onLogout,
  hashtags,
  activeProjectHashtag,
  projectsToRender,
  hasMoreProjects,
  onNewProjectClick,
  onBlogMenuClick,
  onContactClick,
  projectsQuantity,
  onShowMoreProjects,
  onEditProjectButtonClick,
  onDeleteProjectButtonClick,
  onProjectHashtagClick,
  onHomeClick,
  onPostsClick,
  onProjectsClick,
  onAboutClick,
}) {
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const getMostUsedHashtags = (hashtagsArray) => {
    let result = {};
    for (let i = 0; i < hashtagsArray.length; ++i) {
      if (!result[hashtagsArray[i]]) {
        result[hashtagsArray[i]] = 0;
      }
      ++result[hashtagsArray[i]];
    }
    return Object.entries(result).sort((a, b) => b[1] - a[1]);
  };

  const hashtagsToRender = getMostUsedHashtags(hashtags || []);

  function handleProjectDetailsOpen(project) {
    setSelectedProject(project);
  }

  function handleProjectDetailsClose() {
    setSelectedProject(null);
  }

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
      <ProjectsHero loggedIn={loggedIn} onNewProjectClick={onNewProjectClick} />
      <ProjectHashtags
        hashtags={hashtagsToRender || []}
        activeHashtag={activeProjectHashtag}
        onHashtagClick={onProjectHashtagClick}
      />
      {projectsToRender.length !== 0 ? (
        <>
          <ProjectsContainer
            loggedIn={loggedIn}
            projects={projectsToRender}
            projectsNumber={projectsQuantity}
            containerClassname="projects-page"
            onEditProjectButtonClick={onEditProjectButtonClick}
            onDeleteProjectButtonClick={onDeleteProjectButtonClick}
            onHashtagClick={onProjectHashtagClick}
            onSeeMoreProjectClick={handleProjectDetailsOpen}
          />
          {hasMoreProjects && (
            <ShowMoreButton
              onShowMoreButtonClick={onShowMoreProjects}
              buttonText="Show more projects"
            />
          )}
        </>
      ) : (
        <ContentNotFound
          loggedIn={loggedIn}
          altText="projects not found icon"
          text="Sorry, there are no projects yet"
          buttonText="Add project"
          onClick={onNewProjectClick}
        />
      )}
      <ProjectDetailsPopup
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={handleProjectDetailsClose}
        onHashtagClick={onProjectHashtagClick}
      />
      <BlogFooter />
    </div>
  );
}

export default ProjectsPage;
