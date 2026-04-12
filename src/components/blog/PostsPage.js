import { useEffect } from "react";
import BlogHeader from "./BlogHeader";
import PostsSearch from "./PostsSearch";
import PostHashtags from "./PostHashtags";
import Posts from "./Posts";
import BlogFooter from "./BlogFooter";
import ShowMoreButton from "./ShowMoreButton.js";
import AddNewItemButton from "./AddNewItemButton.js";
import ContentNotFound from "./ContentNotFound.js";

function PostsPage({
  loggedIn,
  activePage,
  postsToRender,
  onNewPostClick,
  onEditPostButtonClick,
  onDeletePostButtonClick,
  onBlogMenuClick,
  onHomeClick,
  onPostsClick,
  onProjectsClick,
  onAboutClick,
  onContactClick,
  onPostsSearch,
  onPostClick,
  postsQuantity,
  onShowMorePosts,
  isLoading,
  query,
  querySetter,
  onPostHashtagClick,
  activeHashtag,
}) {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="blog">
      <BlogHeader
        activePage={activePage}
        onBlogMenuClick={onBlogMenuClick}
        onHomeClick={onHomeClick}
        onPostsClick={onPostsClick}
        onProjectsClick={onProjectsClick}
        onAboutClick={onAboutClick}
        onContactClick={onContactClick}
      />
      <PostsSearch
        onSubmit={onPostsSearch}
        isLoading={isLoading}
        query={query}
        querySetter={querySetter}
        activeHashtag={activeHashtag}
      />
      <PostHashtags
        onClick={onPostHashtagClick}
        activeHashtag={activeHashtag}
        query={query}
      />
      {postsToRender.length !== 0 ? (
        <>
          <Posts
            posts={postsToRender}
            postsQuantity={postsQuantity}
            onPostClick={onPostClick}
            onEditPostButtonClick={onEditPostButtonClick}
            onDeletePostButtonClick={onDeletePostButtonClick}
            loggedIn={loggedIn}
          />
          {postsToRender.length > postsQuantity ? (
            <ShowMoreButton
              onShowMoreButtonClick={onShowMorePosts}
              buttonText="Show more posts"
            />
          ) : (
            ""
          )}
          {loggedIn && (
            <AddNewItemButton
              buttonText="New post"
              onAddNewItem={onNewPostClick}
            />
          )}
        </>
      ) : (
        <ContentNotFound
          loggedIn={loggedIn}
          classname="content-not-found_screen_full"
          altText="posts not found icon"
          text="Sorry, there are no posts yet"
          buttonText="Add post"
          onClick={onNewPostClick}
        />
      )}
      <BlogFooter />
    </div>
  );
}

export default PostsPage;
