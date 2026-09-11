import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../shared/utils/api";
import BlogHeader from "./BlogHeader";
import CurrentPost from "./CurrentPost";
import { useCallback } from "react";
import ContentLoader from "../../../app/components/ContentLoader";

function CurrentPostPage({
  activePage,
  loggedIn,
  currentUser,
  onLogout,
  onBlogMenuClick,
  onHomeClick,
  onPostsClick,
  onProjectsClick,
  onAboutClick,
  onContactClick,
  onBackButtonClick,
  onEditPostButtonClick,
  onDeletePostButtonClick,
  postVersion,
  openModal,
  isMenuOpen,
}) {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [isPostLoading, setIsPostLoading] = useState(true);

  const loadPost = useCallback(
    () => {
      setIsPostLoading(true);

      return api
        .getPost(id)
        .then(setPost)
        .catch((err) => {
          openModal({
            status: "error",
            message: err.message,
          });
        })
        .finally(() => setIsPostLoading(false));
    },
    [id, openModal],
  );

  useEffect(() => {
    loadPost();
  }, [loadPost, postVersion]);

  return (
    <div className="blog">
      <BlogHeader
        loggedIn={loggedIn}
        currentUser={currentUser}
        onLogout={onLogout}
        activePage={activePage}
        onBlogMenuClick={onBlogMenuClick}
        onHomeClick={onHomeClick}
        onPostsClick={onPostsClick}
        onProjectsClick={onProjectsClick}
        onAboutClick={onAboutClick}
        onContactClick={onContactClick}
        isMenuOpen={isMenuOpen}
      />
      <main>
        {isPostLoading ? (
          <ContentLoader
            label="Loading post"
            className="content-loader_location_single-post"
          />
        ) : post ? (
          <CurrentPost
            post={post}
            location="single-post"
            onBackButtonClick={onBackButtonClick}
            onEditPostButtonClick={onEditPostButtonClick}
            onDeletePostButtonClick={onDeletePostButtonClick}
            loggedIn={loggedIn}
          />
        ) : null}
      </main>
    </div>
  );
}

export default CurrentPostPage;
