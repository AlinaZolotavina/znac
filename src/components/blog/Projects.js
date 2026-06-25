import AuxiliaryButtons from "./AuxiliaryButtons";
import ProjectsContainer from "./ProjectsContainer";
import ContentNotFound from "./ContentNotFound";

function Projects({
  loggedIn,
  projects,
  onViewAllClick,
  projectsNumber,
  containerClassname,
  onAddProjectClick,
  onEditProjectButtonClick,
  onDeleteProjectButtonClick,
}) {
  return (
    <div className="projects">
      <div className="projects__menu">
        <h2 className="section-title projects__title">Projects</h2>
        {projects.length !== 0 && (
          <AuxiliaryButtons
            loggedIn={loggedIn}
            onViewAllClick={onViewAllClick}
            onAddButtonClick={onAddProjectClick}
            isThereMoreContent={projects.length > 2}
          />
        )}
      </div>
      {projects.length !== 0 ? (
        <ProjectsContainer
          loggedIn={loggedIn}
          projects={projects}
          projectsNumber={projectsNumber}
          classname={containerClassname}
          onEditProjectButtonClick={onEditProjectButtonClick}
          onDeleteProjectButtonClick={onDeleteProjectButtonClick}
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
    </div>
  );
}

export default Projects;
