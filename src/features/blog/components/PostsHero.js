import AddNewItemButton from "./AddNewItemButton";
import PageHero from "./PageHero";

function PostsHero({ loggedIn, onNewPostClick }) {
  return (
    <PageHero
      title="Posts"
      subtitle="Thoughts and notes from my journey in web development and beyond."
      heroId="posts-hero-title"
      className="posts-hero"
      contentClassName="posts-hero__content"
      titleClassName="posts-hero__title"
      subtitleClassName="posts-hero__subtitle"
      illustrationClassName="posts-hero__illustration"
    >
      {loggedIn && (
        <AddNewItemButton
          buttonText="New post"
          onAddNewItem={onNewPostClick}
          className="add-new-item_location_posts-hero"
          alwaysShowText
        />
      )}
    </PageHero>
  );
}

export default PostsHero;
