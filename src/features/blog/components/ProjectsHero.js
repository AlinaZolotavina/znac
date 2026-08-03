import AddNewItemButton from "./AddNewItemButton";
import PageHero from "./PageHero";

function ProjectsHero({ loggedIn, onNewProjectClick }) {
  return (
    <PageHero
      title="Projects"
      subtitle="Things I build with code."
      heroId="projects-hero-title"
      className="projects-hero"
      contentClassName="projects-hero__content"
      titleClassName="projects-hero__title"
      subtitleClassName="projects-hero__subtitle"
      illustrationClassName="projects-hero__illustration"
    >
      {loggedIn && (
        <AddNewItemButton
          buttonText="New project"
          onAddNewItem={onNewProjectClick}
          className="add-new-item_location_projects-hero"
          alwaysShowText
        />
      )}
    </PageHero>
  );
}

export default ProjectsHero;
