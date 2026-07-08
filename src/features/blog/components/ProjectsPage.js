import { useEffect } from "react";
import BlogHeader from "./BlogHeader";
import ProjectHashtags from "./ProjectHashtags.js";
import ProjectsContainer from "./ProjectsContainer";
import BlogFooter from "./BlogFooter";
// import projectHashtags from "../../utils/projectHashtags";
import ShowMoreButton from "./ShowMoreButton.js";
import AddNewItemButton from "./AddNewItemButton.js";
import ContentNotFound from "./ContentNotFound.js";

function ProjectsPage({
  loggedIn,
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
            classname="projects-page"
            onEditProjectButtonClick={onEditProjectButtonClick}
            onDeleteProjectButtonClick={onDeleteProjectButtonClick}
            onHashtagClick={onProjectHashtagClick}
          />
          {hasMoreProjects && (
            <ShowMoreButton
              onShowMoreButtonClick={onShowMoreProjects}
              buttonText="Show more projects"
            />
          )}
          {loggedIn && (
            <AddNewItemButton
              buttonText="New project"
              onAddNewItem={onNewProjectClick}
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
      <BlogFooter />
    </div>
  );
}

export default ProjectsPage;
