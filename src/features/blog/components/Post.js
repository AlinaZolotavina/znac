import { useEffect, useState } from "react";
import getDate from "../utils/getDate";
import useOverflow from "../hooks/useOverflow";
import BlogActionButtons from "./BlogActionButtons";

function Post({
  post,
  onPostClick,
  onEditPostButtonClick,
  onDeletePostButtonClick,
  loggedIn,
  location,
}) {
  const date = getDate(post.createdAt);
  const iconAliases = {
    javascript: "js",
    illustration: "illustrations",
  };
  const postIcon = iconAliases[post.icon] || post.icon;
  const [isPhotoBroken, setIsPhotoBroken] = useState(false);
  const { ref: textRef, isOverflowing: isTextOverflowing } = useOverflow(
    post.text,
  );
  const shouldShowPhoto = post.photoLink && !isPhotoBroken;

  useEffect(() => {
    setIsPhotoBroken(false);
  }, [post.photoLink]);

  function handlePostClick() {
    onPostClick(post);
  }

  function handleEditClick(e) {
    e.stopPropagation();
    onEditPostButtonClick(post);
  }

  function handleDeleteClick(e) {
    e.stopPropagation();
    onDeletePostButtonClick(post);
  }

  return (
    <li className={`post post_location_${location}`}>
      <article>
        <button
          className="post__open-btn"
          type="button"
          onClick={handlePostClick}
          aria-label={`Open post ${post.title}`}
        >
          {shouldShowPhoto ? (
            <img
              className={`post__preview post__preview_location_${location}`}
              src={post.photoLink}
              alt={`Illustration for post "${post.title}"`}
              loading="lazy"
              onError={() => setIsPhotoBroken(true)}
            />
          ) : (
            <div
              className={`post__icon post__icon_location_${location} post__icon_type_${postIcon}`}
            />
          )}
          <div className="post__content">
            <div className="post__meta">
              <p className={`post__theme post__theme_location_${location}`}>
                {post.theme}
              </p>
              <p className={`post__date post__date_location_${location}`}>
                {date}
              </p>
            </div>
            <h3 className={`post__title post__title_location_${location}`}>
              {post.title}
            </h3>
            <p className={`post__text post__text_location_${location}`}>
              <span className="post__text-content" ref={textRef}>
                {post.text}
              </span>
            </p>
            {isTextOverflowing && (
              <span className="post__read-more">Read more →</span>
            )}
          </div>
        </button>
        {loggedIn && (
          <div className="post__tools">
            <BlogActionButtons
              editId="post-edit-btn"
              deleteId="post-delete-btn"
              editLabel="Edit post"
              deleteLabel="Delete post"
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </div>
        )}
      </article>
    </li>
  );
}

export default Post;
