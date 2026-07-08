import Project from "./Project";

function ProjectsContainer({
  loggedIn,
  projects,
  projectsNumber,
  classname,
  onEditProjectButtonClick,
  onDeleteProjectButtonClick,
  onHashtagClick,
}) {
  return (
    <ul
      className={`projects__container projects__container_location_${classname}`}
    >
      {projects.slice(0, projectsNumber).map((project) => (
        <Project
          key={project._id}
          loggedIn={loggedIn}
          project={project}
          onEditProjectButtonClick={onEditProjectButtonClick}
          onDeleteProjectButtonClick={onDeleteProjectButtonClick}
          onHashtagClick={onHashtagClick}
        />
      ))}
    </ul>
  );
}

export default ProjectsContainer;
