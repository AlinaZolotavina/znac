import { useState } from "react";
import AuxiliaryButtons from "./AuxiliaryButtons";
import ProjectsContainer from "./ProjectsContainer";
import ContentNotFound from "./ContentNotFound";
import ProjectDetailsPopup from "./ProjectDetailsPopup";

function Projects({
  loggedIn,
  projects,
  isThereMoreContent,
  onViewAllClick,
  projectsNumber,
  containerClassname,
  onAddProjectClick,
  onEditProjectButtonClick,
  onDeleteProjectButtonClick,
}) {
  const [selectedProject, setSelectedProject] = useState(null);

  function handleProjectDetailsOpen(project) {
    setSelectedProject(project);
  }

  function handleProjectDetailsClose() {
    setSelectedProject(null);
  }

  return (
    <div className="projects">
      <div className="projects__menu">
        <h2 className="section-title projects__title">Projects</h2>
        {projects.length !== 0 && (
          <AuxiliaryButtons
            loggedIn={loggedIn}
            onViewAllClick={onViewAllClick}
            onAddButtonClick={onAddProjectClick}
            isThereMoreContent={isThereMoreContent}
          />
        )}
      </div>
      {projects.length !== 0 ? (
        <ProjectsContainer
          loggedIn={loggedIn}
          projects={projects}
          projectsNumber={projectsNumber}
          containerClassname={containerClassname}
          onEditProjectButtonClick={onEditProjectButtonClick}
          onDeleteProjectButtonClick={onDeleteProjectButtonClick}
          onSeeMoreProjectClick={handleProjectDetailsOpen}
        />
      ) : (
        <ContentNotFound
          loggedIn={loggedIn}
          altText="projects not found icon"
          text="Sorry, there are no projects yet"
          buttonText="Add project"
          onClick={onAddProjectClick}
        />
      )}
      <ProjectDetailsPopup
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={handleProjectDetailsClose}
      />
    </div>
  );
}

export default Projects;
