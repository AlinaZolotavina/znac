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
  const date = Date.now();
  return (
    <ul
      className={`projects__container projects__container_location_${classname}`}
    >
      {projects.slice(0, projectsNumber).map((project) => (
        <Project
          key={`${project._id}${date}`}
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
