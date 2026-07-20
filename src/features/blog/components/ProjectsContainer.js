import Masonry from "react-masonry-css";
import Project from "./Project";

const breakpointColumnsObj = {
  default: 3,
  900: 2,
  600: 1,
};

function ProjectsContainer({
  loggedIn,
  projects,
  projectsNumber,
  containerClassname,
  onEditProjectButtonClick,
  onDeleteProjectButtonClick,
  onHashtagClick,
}) {
  if (containerClassname === "projects-page") {
    return (
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className={`projects__container projects__container_location_${containerClassname}`}
        columnClassName="projects__column"
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
      </Masonry>
    );
  } else {
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
          />
        ))}
      </ul>
    );
  }
}

export default ProjectsContainer;
