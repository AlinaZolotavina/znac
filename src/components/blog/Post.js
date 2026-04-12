// import { useEffect } from "react";
import getDate from "../../utils/getDate";
function Post({
  post,
  onPostClick,
  onEditPostButtonClick,
  onDeletePostButtonClick,
  loggedIn,
  location,
}) {
  const date = getDate(post.createdAt);

  function handleClick(e) {
    if (e.target.id === "post-delete-btn") {
      onDeletePostButtonClick(post);
    } else if (e.target.id === "post-edit-btn") {
      onEditPostButtonClick(post);
    } else {
      onPostClick(post);
    }
  }

  return (
    <li className={`post post_location_${location}`} onClick={handleClick}>
      <div
        className={`post__icon post__icon_location_${location} post__icon_type_${post.icon}`}
      />
      <p className={`post__theme post__theme_location_${location}`}>
        {post.theme}
      </p>
      <h3 className={`post__title post__title_location_${location}`}>
        {post.title}
      </h3>
      <p className={`post__text post__text_location_${location}`}>
        {post.text}
      </p>
      <div
        className={`post__date-and-tools post__date-and-tools_location_${location}`}
      >
        <p className={`post__date post__date_location_${location}`}>{date}</p>
        {loggedIn && <button id="post-edit-btn" className="blog-edit-btn" />}
        {loggedIn && (
          <button id="post-delete-btn" className="blog-delete-btn" />
        )}
      </div>
    </li>
  );
}

export default Post;
