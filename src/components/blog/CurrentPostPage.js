import BlogHeader from "./BlogHeader";
import CurrentPost from "./CurrentPost";
import { useEffect } from "react";

function CurrentPostPage({
  activePage,
  onBlogMenuClick,
  onHomeClick,
  onPostsClick,
  onProjectsClick,
  onAboutClick,
  onContactClick,
  post,
  onBackButtonClick,
  onEditPostButtonClick,
  onDeletePostButtonClick,
  loggedIn,
}) {
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
      {post.title ? (
        <CurrentPost
          post={post}
          location="single-post"
          onBackButtonClick={onBackButtonClick}
          onEditPostButtonClick={onEditPostButtonClick}
          onDeletePostButtonClick={onDeletePostButtonClick}
          loggedIn={loggedIn}
        />
      ) : (
        <CurrentPost
          post={JSON.parse(localStorage.getItem("currentPost"))}
          location="single-post"
          onBackButtonClick={onBackButtonClick}
          onEditPostButtonClick={onEditPostButtonClick}
          onDeletePostButtonClick={onDeletePostButtonClick}
          loggedIn={loggedIn}
        />
      )}
    </div>
  );
}

export default CurrentPostPage;
