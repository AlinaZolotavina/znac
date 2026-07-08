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
  postsToRender,
  onNewPostClick,
  onEditPostButtonClick,
  onDeletePostButtonClick,
  onBlogMenuClick,
  onContactClick,
  onPostsSearch,
  onPostClick,
  hasMorePosts,
  postsQuantity,
  onShowMorePosts,
  isLoading,
  query,
  querySetter,
  onPostHashtagClick,
  activeHashtag,
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
          {hasMorePosts && (
            <ShowMoreButton
              onShowMoreButtonClick={onShowMorePosts}
              buttonText="Show more posts"
            />
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
