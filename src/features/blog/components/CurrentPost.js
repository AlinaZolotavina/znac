import { useState, useEffect } from "react";
import errorImage from "../../../app/assets/image-error.svg";
import BlogHashtag from "./BlogHashtag";
import BackButton from "./BackButton";
import getDate from "../utils/getDate";
import fixShortWords from "../utils/fixShortWords";
import isValidUrl from "../../../shared/utils/isValidUrl";
import BlogActionButtons from "./BlogActionButtons";

function CurrentPost({
  post,
  location,
  onBackButtonClick,
  onEditPostButtonClick,
  onDeletePostButtonClick,
  loggedIn,
}) {
  const postDate = getDate(post.createdAt);
  const postHashtags = Array.isArray(post.hashtags)
    ? post.hashtags
    : post.hashtags?.split(" ") || [];
  const date = Date.now();
  const [currentImage, setCurrentImage] = useState(errorImage);
  const paragraps = post.text
    .split("\n")
    .map((paragraph) => fixShortWords(paragraph));

  const [isPortrait, setIsPortrait] = useState(false);
  const handleLoad = (e) => {
    const img = e.target;
    if (img.naturalHeight > img.naturalWidth) {
      setIsPortrait(true);
    }
  };

  const checkImageUrl = (src) => {
    if (isValidUrl(src)) {
      setCurrentImage(src);
    } else {
      setCurrentImage(errorImage);
    }
  };

  useEffect(() => {
    checkImageUrl(post.photoLink);
  }, [post.photoLink]);

  function handleClick(e) {
    if (e.target.id === "blog-delete-btn") {
      onDeletePostButtonClick(post, true);
    } else if (e.target.id === "blog-edit-btn") {
      onEditPostButtonClick(post);
    }
    e.target.blur();
  }

  return (
    <section className={`post post_location_${location}`} onClick={handleClick}>
      <p className={`post__theme post__theme_location_${location}`}>
        {post.theme}
      </p>
      <h3 className={`post__title post__title_location_${location}`}>
        {post.title}
      </h3>
      <ul className="post__hashtags">
        {postHashtags.map((value, key) => (
          <BlogHashtag
            key={`${key}${date}`}
            hashtag={value}
            isSymbolActive={true}
            classname="post__hashtag"
          />
        ))}
      </ul>
      {post.photoLink && (
        <img
          className={`post__image ${isPortrait ? "post__image_orientation_portrait" : ""}`}
          src={currentImage}
          alt={`Illustration for post "${post.title}"`}
          onLoad={handleLoad}
        />
      )}
      {paragraps.map((value, key) => (
        <p
          key={`${key}${date}`}
          className={`post__text post__text_location_${location}`}
        >
          {value}
        </p>
      ))}
      <div className="post__date-and-tools post__date-and-tools_location_single-post">
        <p className="post__date post__date_location_single-post">{postDate}</p>
        {loggedIn && (
          <BlogActionButtons
            editId="blog-edit-btn"
            deleteId="blog-delete-btn"
            editLabel="Edit post"
            deleteLabel="Delete post"
          />
        )}
      </div>
      <BackButton onBackButtonClick={onBackButtonClick} />
    </section>
  );
}

export default CurrentPost;
