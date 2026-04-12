/* eslint-disable no-useless-escape */
import { useState, useEffect } from "react";
import errorImage from "../../images/image-error.svg";
import BlogHashtag from "./BlogHashtag";
import BackButton from "./BackButton";
import getDate from "../../utils/getDate";
import fixShortWords from "../../utils/fixShortWords";

function CurrentPost({
  post,
  location,
  onBackButtonClick,
  onEditPostButtonClick,
  onDeletePostButtonClick,
  loggedIn,
}) {
  const postDate = getDate(post.createdAt);
  const postHashtags = post.hashtags.split(" ");
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
    const regex =
      /^(https?:\/\/)(w{3})?([\da-z\.\-]+)\.([a-z\.]{2,6})([\w\.\-\_%~:\/?#\[\]@!$&\'()*\+,;=])*#?\/?$/;
    if (regex.test(src)) {
      setCurrentImage(src);
    } else {
      setCurrentImage(errorImage);
    }
  };

  useEffect(() => {
    checkImageUrl(post.photoLink);
  });

  function handleClick(e) {
    if (e.target.id === "blog-delete-btn") {
      onDeletePostButtonClick(post);
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
      <div className="post__hashtags">
        {postHashtags.map((value, key) => (
          <BlogHashtag
            key={`${key}${date}`}
            hashtag={value}
            isSymbolActive={true}
            classname="post__hashtag"
          />
        ))}
      </div>
      {
        post.photoLink && (
          // <div className='post__image-container'>
          //     <button className={`flip-btn flip-btn_left ${isLeftFlipDisabled && 'flip-btn_disabled'}`} onClick={handleLeftFlip} disabled={isLeftFlipDisabled} />
          // eslint-disable-next-line jsx-a11y/img-redundant-alt
          <img
            className={`post__image ${isPortrait ? "post__image_orientation_portrait" : ""}`}
            src={currentImage}
            alt="post photo"
            onLoad={handleLoad}
          />
        )
        //     <button className={`flip-btn flip-btn_right ${isRightFlipDisabled && 'flip-btn_disabled'}`} onClick={handleRightFlip} disabled={isRightFlipDisabled} />
        // </div>
      }
      {paragraps.map((value, key) => (
        <p
          key={`${key}${date}`}
          className={`post__text post__text_location_${location}`}
        >
          {value}
        </p>
      ))}
      <div className="post__date-and-tools">
        <p className="post__date post__date_location_single-post">{postDate}</p>
        {loggedIn && <button id="blog-edit-btn" className="blog-edit-btn" />}
        {loggedIn && (
          <button id="blog-delete-btn" className="blog-delete-btn" />
        )}
      </div>
      <BackButton onBackButtonClick={onBackButtonClick} />
    </section>
  );
}

export default CurrentPost;
