import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../shared/utils/api";
import BlogHeader from "./BlogHeader";
import CurrentPost from "./CurrentPost";
import ContentLoader from "../../../app/components/ContentLoader";
import Seo, { getPostDescription } from "../../../app/components/Seo";

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

  const [request, setRequest] = useState(null);
  const currentRequest =
    request?.id === id && request?.version === postVersion ? request : null;
  const post = currentRequest?.post;
  const isPostLoading = !currentRequest || currentRequest.loading;
  const isIndexable = Boolean(post?.title?.trim() && post?.text?.trim());
  const unavailableTitle =
    currentRequest?.error?.status === 404
      ? "Post not found — ZNAC"
      : "Post unavailable — ZNAC";

  useEffect(() => {
    let active = true;
    setRequest({ id, version: postVersion, loading: true });

    api
      .getPost(id)
      .then((loadedPost) => {
        if (active) {
          setRequest({ id, version: postVersion, post: loadedPost, loading: false });
        }
      })
      .catch((error) => {
        if (!active) return;
        setRequest({ id, version: postVersion, error, loading: false });
        openModal({ status: "error", message: error.message });
      });

    return () => {
      active = false;
    };
  }, [id, openModal, postVersion]);

  return (
    <div className="blog">
      <Seo
        title={
          post ? `${post.title} — ZNAC`
            : isPostLoading ? "Loading post — ZNAC" : unavailableTitle
        }
        description={
          post ? getPostDescription(post.text)
            : isPostLoading ? "Loading a journal post from ZNAC."
              : "The requested journal post is unavailable."
        }
        canonicalPath={
          isIndexable ? `/journal/posts/${encodeURIComponent(id)}` : undefined
        }
        image={post?.photoLink}
        type={post ? "article" : "website"}
        indexable={isIndexable}
      />
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
