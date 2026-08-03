import { useEffect } from "react";
import BlogHeader from "./BlogHeader";
import PostsHero from "./PostsHero";
import PostsSearch from "./PostsSearch";
import PostHashtags from "./PostHashtags";
import Posts from "./Posts";
import BlogFooter from "./BlogFooter";
import ShowMoreButton from "./ShowMoreButton.js";
import ContentNotFound from "./ContentNotFound.js";

function PostsPage({
  loggedIn,
  currentUser,
  onLogout,
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
        loggedIn={loggedIn}
        currentUser={currentUser}
        onLogout={onLogout}
        onBlogMenuClick={onBlogMenuClick}
        onContactClick={onContactClick}
        onHomeClick={onHomeClick}
        onPostsClick={onPostsClick}
        onProjectsClick={onProjectsClick}
        onAboutClick={onAboutClick}
      />
      <PostsHero loggedIn={loggedIn} onNewPostClick={onNewPostClick} />
      <div className="posts-page-controls">
        <PostsSearch
          onSubmit={onPostsSearch}
          isLoading={isLoading}
          query={query}
          querySetter={querySetter}
          activeHashtag={activeHashtag}
        />
      </div>
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
