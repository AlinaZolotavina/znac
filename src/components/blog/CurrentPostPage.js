import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";
import BlogHeader from "./BlogHeader";
import CurrentPost from "./CurrentPost";

function CurrentPostPage({
  activePage,
  onBlogMenuClick,
  onHomeClick,
  onPostsClick,
  onProjectsClick,
  onAboutClick,
  onContactClick,
  onBackButtonClick,
  onEditPostButtonClick,
  onDeletePostButtonClick,
  loggedIn,
  openModal,
}) {
  const { id } = useParams();

  const [post, setPost] = useState(null);

  useEffect(() => {
    api
      .getPost(id)
      .then(setPost)
      .catch((err) => {
        openModal({
          status: "error",
          message: err.message,
        });
      });
  }, [id]);

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

      {post && (
        <CurrentPost
          post={post}
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
