import Project from "./Project";

function ProjectsContainer({
  loggedIn,
  projects,
  projectsNumber,
  containerClassname,
  onEditProjectButtonClick,
  onDeleteProjectButtonClick,
  onHashtagClick,
  onSeeMoreProjectClick,
}) {
  return (
    <ul
      className={`projects__container projects__container_location_${containerClassname}`}
    >
      {projects.slice(0, projectsNumber).map((project) => (
        <Project
          key={project._id}
          loggedIn={loggedIn}
          project={project}
          onEditProjectButtonClick={onEditProjectButtonClick}
          onDeleteProjectButtonClick={onDeleteProjectButtonClick}
          onHashtagClick={onHashtagClick}
          onSeeMoreProjectClick={onSeeMoreProjectClick}
        />
      ))}
    </ul>
  );
}

export default ProjectsContainer;
