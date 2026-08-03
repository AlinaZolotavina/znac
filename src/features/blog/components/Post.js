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
  const { ref: textRef, isOverflowing: isTextOverflowing } = useOverflow(
    post.text,
  );

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

  function handleKeyDown(e) {
    if (e.target !== e.currentTarget) {
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onPostClick(post);
    }
  }

  return (
    <li
      className={`post post_location_${location}`}
      onClick={handlePostClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex="0"
    >
      <div
        className={`post__icon post__icon_location_${location} post__icon_type_${post.icon}`}
      />
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
    </li>
  );
}

export default Post;
