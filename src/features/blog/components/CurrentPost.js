import { useState, useEffect } from "react";
import errorImage from "../../../app/assets/image-error.svg";
import BlogHashtag from "./BlogHashtag";
import BackButton from "./BackButton";
import getDate from "../utils/getDate";
import fixShortWords from "../utils/fixShortWords";
import isValidUrl from "../../../shared/utils/isValidUrl";
import BlogActionButtons from "./BlogActionButtons";
import ContentLoader from "../../../app/components/ContentLoader";

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
  const imageSrc = isValidUrl(post.photoLink) ? post.photoLink : null;
  const [isImageBroken, setIsImageBroken] = useState(false);
  const [loadedImageSrc, setLoadedImageSrc] = useState(null);
  const paragraps = post.text
    .split("\n")
    .filter((paragraph) => paragraph.trim())
    .map((paragraph) => fixShortWords(paragraph));

  const [isPortrait, setIsPortrait] = useState(false);
  const handleLoad = (e) => {
    const img = e.target;
    if (img.naturalHeight > img.naturalWidth) {
      setIsPortrait(true);
    }
  };

  useEffect(() => {
    setIsImageBroken(false);
    setLoadedImageSrc(null);
    setIsPortrait(false);
  }, [post._id, imageSrc]);

  const shouldShowImage = Boolean(imageSrc);
  const isImageLoading = shouldShowImage && !isImageBroken && loadedImageSrc !== imageSrc;
  const displayedImageSrc = isImageBroken ? errorImage : imageSrc;

  return (
    <section className={`post post_location_${location}`}>
      <p className={`post__theme post__theme_location_${location}`}>
        {post.theme}
      </p>
      <h1 className={`post__title post__title_location_${location}`}>
        {post.title}
      </h1>
      <ul className="post__hashtags">
        {postHashtags.map((value, key) => (
          <BlogHashtag
            key={`${post._id}-hashtag-${key}`}
            hashtag={value}
            isSymbolActive={true}
            classname="post__hashtag"
          />
        ))}
      </ul>
      {shouldShowImage && (
        <div
          className={`post__image-container ${
            isImageLoading ? "post__image-container_state_loading" : ""
          }`}
          aria-busy={isImageLoading}
        >
          {isImageLoading && (
            <ContentLoader
              label="Loading post image"
              className="content-loader_location_single-post-image"
            />
          )}
          <img
            className={`post__image ${
              isPortrait ? "post__image_orientation_portrait" : ""
            }`}
            src={displayedImageSrc}
            alt={`Illustration for post "${post.title}"`}
            onLoad={(event) => {
              handleLoad(event);
              setLoadedImageSrc(displayedImageSrc);
            }}
            onError={() => setIsImageBroken(true)}
          />
        </div>
      )}
      {paragraps.map((value, key) => (
        <p
          key={`${post._id}-paragraph-${key}`}
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
            onEdit={() => onEditPostButtonClick(post)}
            onDelete={() => onDeletePostButtonClick(post, true)}
          />
        )}
      </div>
      <BackButton onBackButtonClick={onBackButtonClick} />
    </section>
  );
}

export default CurrentPost;
