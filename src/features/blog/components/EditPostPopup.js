import { useState, useEffect, useRef } from "react";
import BlogForm from "./BlogForm.js";
import BlogInput from "./BlogInput.js";
import BlogCloseButton from "./BlogCloseButton.js";
import NewPostRadioButton from "./NewPostRadioButton.js";
import BlogUploadFileInfo from "./BlogUploadFileInfo.js";
import BlogTextArea from "./BlogTextArea.js";
import iconButtons from "../utils/iconButtons.js";
import hashtagsToInputValue from "../utils/hashtagsToInputValue.js";
import useInitialFocus from "../../../shared/hooks/useInitialFocus.js";
import useFocusTrap from "../../../shared/hooks/useFocusTrap.js";
import useReturnFocus from "../../../shared/hooks/useReturnFocus.js";
import useCloseOnEsc from "../../../shared/hooks/useCloseOnEsc.js";
import useLockBodyScroll from "../../../shared/hooks/useLockBodyScroll.js";
import useOverlayClickClose from "../../../shared/hooks/useOverlayClickClose.js";

function getVisibleCount(width, containerWidth) {
  if (containerWidth) {
    const iconWidth = width <= 1280 ? 75 : 85;
    const gap = 10;

    return Math.min(
      Math.max(Math.floor((containerWidth + gap) / (iconWidth + gap)), 1),
      6,
    );
  }

  if (width <= 480) return 2;
  if (width <= 768) return 4;
  return 6;
}

function normalizeIconValue(icon) {
  const aliases = {
    javascript: "js",
    illustration: "illustrations",
  };

  return aliases[icon] || icon;
}

function getCurrentIconNumber(icon) {
  return iconButtons.findIndex(
    (iconButton) => iconButton.buttonValue === normalizeIconValue(icon),
  );
}

function EditPostPopup({ isOpen, onClose, isSendingReq, post, onEditPost }) {
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    if (Object.keys(post).length !== 0) {
      const normalizedIcon = normalizeIconValue(post.icon);

      setThemeCheckValue(post.theme);
      setIconCheckValue(normalizedIcon);

      const currentIconNumber = getCurrentIconNumber(normalizedIcon);
      const visibleIconsCount = getVisibleCount(
        window.innerWidth,
        iconButtonsRef.current?.clientWidth,
      );
      const lastSlideStart = Math.max(iconButtons.length - visibleIconsCount, 0);
      const centeredSlideStart = Math.max(
        currentIconNumber - Math.floor(visibleIconsCount / 2),
        0,
      );
      const nextSlideStart = Math.min(centeredSlideStart, lastSlideStart);

      setVisibleIconsCount(visibleIconsCount);
      setSlideStart(nextSlideStart);

      setTitle(post.title);
      setHashtags(hashtagsToInputValue(post.hashtags));
      setTextarea(post.text);
      setIsPhotoDeleted(false);
    }
  }, [post, isOpen]);

  const [themeCheckValue, setThemeCheckValue] = useState("");
  const [themeError, setThemeError] = useState("");
  function handleThemeClick(value) {
    setThemeCheckValue(value);
    setIsEdited(true);
  }

  const [iconCheckValue, setIconCheckValue] = useState("");
  const [iconError, setIconError] = useState("");
  function handleIconClick(value) {
    setIconCheckValue(value);
    setIsEdited(true);
  }

  const [slideStart, setSlideStart] = useState(0);
  const iconButtonsRef = useRef(null);
  const iconFocusAfterSlideRef = useRef("");
  const [visibleIconsCount, setVisibleIconsCount] = useState(() =>
    getVisibleCount(window.innerWidth),
  );
  const slideEnd = Math.min(slideStart + visibleIconsCount, iconButtons.length);
  const [isLeftFlipDisabled, setIsLeftFlipDisabled] = useState(true);

  useEffect(() => {
    function handleResize() {
      const visibleIconsCount = getVisibleCount(
        window.innerWidth,
        iconButtonsRef.current?.clientWidth,
      );
      const lastSlideStart = Math.max(iconButtons.length - visibleIconsCount, 0);

      setVisibleIconsCount(visibleIconsCount);
      setSlideStart((prev) => Math.min(prev, lastSlideStart));
    }

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [slideStart]);

  function focusIcon(iconValue) {
    const iconInput = iconButtonsRef.current?.querySelector(
      `input[type="radio"][value="${iconValue}"]`,
    );

    if (iconInput) {
      iconInput.focus();
    }
  }

  function handleIconArrowNavigate(e, currentValue, direction) {
    e.preventDefault();

    const currentIndex = iconButtons.findIndex(
      (iconButton) => iconButton.buttonValue === currentValue,
    );

    if (currentIndex === -1) {
      return;
    }

    if (
      (direction === "right" && currentIndex === iconButtons.length - 1) ||
      (direction === "left" && currentIndex === 0)
    ) {
      return;
    }

    const nextIndex =
      direction === "right" ? currentIndex + 1 : currentIndex - 1;
    const nextIcon = iconButtons[nextIndex];

    if (nextIndex >= slideStart && nextIndex < slideEnd) {
      focusIcon(nextIcon.buttonValue);
      return;
    }

    const lastSlideStart = Math.max(iconButtons.length - visibleIconsCount, 0);
    const nextSlideStart =
      direction === "right"
        ? Math.min(nextIndex, lastSlideStart)
        : Math.max(nextIndex - visibleIconsCount + 1, 0);

    iconFocusAfterSlideRef.current = nextIcon.buttonValue;
    setSlideStart(nextSlideStart);
  }

  function handleLeftFlip(e, shouldKeepIconFocus = false) {
    e.preventDefault();
    if (slideStart > 0) {
      const nextSlideStart = slideStart - 1;

      if (shouldKeepIconFocus) {
        iconFocusAfterSlideRef.current = iconButtons[nextSlideStart].buttonValue;
      }

      setSlideStart(nextSlideStart);
    }
  }

  const [isRightFlipDisabled, setIsRightFlipDisabled] = useState(false);
  function handleRightFlip(e, shouldKeepIconFocus = false) {
    e.preventDefault();
    if (slideEnd < iconButtons.length) {
      const lastSlideStart = Math.max(
        iconButtons.length - visibleIconsCount,
        0,
      );
      const nextSlideStart = Math.min(slideStart + 1, lastSlideStart);

      if (shouldKeepIconFocus) {
        const nextFocusIndex = Math.min(
          nextSlideStart + visibleIconsCount - 1,
          iconButtons.length - 1,
        );

        iconFocusAfterSlideRef.current = iconButtons[nextFocusIndex].buttonValue;
      }

      setSlideStart(nextSlideStart);
    }
  }

  useEffect(() => {
    if (slideStart === 0) {
      setIsLeftFlipDisabled(true);
    } else {
      setIsLeftFlipDisabled(false);
    }
    if (slideEnd >= iconButtons.length) {
      setIsRightFlipDisabled(true);
    } else {
      setIsRightFlipDisabled(false);
    }
  }, [slideStart, slideEnd]);

  useEffect(() => {
    if (!iconFocusAfterSlideRef.current) {
      return;
    }

    focusIcon(iconFocusAfterSlideRef.current);
    iconFocusAfterSlideRef.current = "";
  }, [slideStart]);

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  function handleTitleChange(e) {
    const regex = /^[\p{L}0-9 _()\-:!?]*$/u;
    if (e.target.value.length === 0) {
      setTitleError("Title is required");
    } else if (!regex.test(e.target.value)) {
      setTitleError("Only letters, numbers, spaces and _()-:!? are allowed");
    } else {
      setTitleError("");
    }
    setTitle(e.target.value);
    setIsEdited(true);
  }

  const [postPhotos, setPostPhotos] = useState([]);
  const [isPhotoDeleted, setIsPhotoDeleted] = useState(false);
  const hasPhoto =
    !isPhotoDeleted && (Boolean(post.photoLink) || postPhotos.length > 0);
  const [photoInfo, setPhotoInfo] = useState("Not selected");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  let fileName;
  const [photoNames, setPhotoNames] = useState([]);

  useEffect(() => {
    if (postPhotos.length === 0) {
      setPhotoInfo("Not selected");
    } else {
      setPhotoInfo("");
    }
  }, [postPhotos]);

  async function handlePreuploadPhoto(e) {
    setIsUploadingPhoto(true);
    let addedPhotos = [];
    let names = [];
    const files = Array.from(e.target.files);
    for (const item of files) {
      fileName = await item.name.slice(0, -4);
      const webPFile = await convert(item, 50);
      names.push(`${fileName}.jpg`);
      addedPhotos.push(webPFile);
      setPhotoNames(names);
    }
    setPostPhotos(addedPhotos, ...postPhotos);
    setIsUploadingPhoto(false);
    setIsEdited(true);
  }

  const convert = (jpgFile) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const webPData = reader.result;
              const webPBlob = new Blob([webPData], { type: "image/webp" });

              const webPFile = new File([webPBlob], `${fileName}.webp`);
              resolve(webPFile);
            };
            reader.onerror = reject;

            reader.readAsArrayBuffer(blob);
          },
          "image/webp",
          0.5,
        );
      };
      img.onerror = reject;

      img.src = URL.createObjectURL(jpgFile);
    });
  };

  const handlePhotoDelete = (e) => {
    e.preventDefault();
    setPostPhotos([]);
    setPhotoNames([]);
    setIsPhotoDeleted(true);
    setIsEdited(true);
  };

  const [hashtags, setHashtags] = useState("");
  const [hashtagsError, setHashtagsError] = useState("");
  function handleHashtagsChange(e) {
    const regex = /^[\p{L}0-9 _]*$/u;
    if (e.target.value.length === 0) {
      setHashtagsError("You must add at least one hashtag");
    } else if (!regex.test(e.target.value)) {
      setHashtagsError("Only letters, numbers and underscores are allowed");
    } else {
      setHashtagsError("");
    }
    setHashtags(e.target.value);
    setIsEdited(true);
  }

  const [textarea, setTextarea] = useState("");
  const [textareaError, setTextareaError] = useState("");
  function handleTextareaChange(e) {
    if (e.target.value.length === 0) {
      setTextareaError("Please enter your message");
    } else {
      setTextareaError("");
    }
    setTextarea(e.target.value);
    setIsEdited(true);
  }

  const [isFormValid, setIsFormValid] = useState(false);
  useEffect(() => {
    if (
      themeCheckValue !== "" &&
      !themeError &&
      iconCheckValue !== "" &&
      !iconError &&
      title &&
      hashtags &&
      textarea &&
      !titleError &&
      !hashtagsError &&
      !textareaError &&
      isEdited
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [
    themeCheckValue,
    themeError,
    iconCheckValue,
    iconError,
    title,
    hashtags,
    textarea,
    titleError,
    hashtagsError,
    textareaError,
    isEdited,
  ]);

  function handleSubmit(e) {
    e.preventDefault();
    onEditPost(post._id, {
      theme: themeCheckValue,
      icon: iconCheckValue,
      title: title,
      photoData: postPhotos,
      removePhoto: isPhotoDeleted,
      hashtags: hashtags,
      text: textarea,
    });
    clearInputs();
  }

  function handleClose() {
    onClose();
    clearInputs();
  }

  const popupRef = useRef(null);

  useReturnFocus(isOpen);
  useInitialFocus(isOpen, popupRef);
  useFocusTrap(isOpen, popupRef);
  useCloseOnEsc(isOpen, handleClose);
  useLockBodyScroll(isOpen);

  const handleOverlayClickClose = useOverlayClickClose(isOpen, handleClose);

  function clearInputs() {
    setThemeCheckValue("");
    setThemeError("");
    setIconCheckValue("");
    setIconError("");
    setSlideStart(0);
    setVisibleIconsCount(getVisibleCount(window.innerWidth));
    setIsLeftFlipDisabled(true);
    setIsRightFlipDisabled(false);
    setTitle("");
    setTitleError("");
    setPostPhotos([]);
    setPhotoInfo("Not selected");
    setPhotoNames([]);
    setHashtags("");
    setHashtagsError("");
    setTextarea("");
    setTextareaError("");
    setIsFormValid(false);
    setIsEdited(false);
  }

  if (!isOpen) return null;

  return (
    <div
      className="popup popup_type_get-in-touch popup_is-opened"
      onMouseDown={handleOverlayClickClose}
    >
      <div
        ref={popupRef}
        className="new-post"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-post-title"
        tabIndex={-1}
      >
        <BlogForm
          formName="new-post"
          formClassname="new-post__form"
          titleClassname="new-post__title"
          titleId="edit-post-title"
          title="Edit post"
          buttonClassname="new-post__submit-btn"
          buttonText="Save post"
          isFormValid={isFormValid}
          isSendingReq={isSendingReq}
          onSubmit={handleSubmit}
        >
          <div className="new-post__radio-buttons-container">
            <span className="new-post__input-label" id="edit-post-theme-label">
              Theme
            </span>
            <div
              className="new-post__radio-buttons new-post__radio-buttons_type_theme"
              role="radiogroup"
              aria-labelledby="edit-post-theme-label"
              aria-invalid={themeError ? "true" : undefined}
              aria-describedby={themeError ? "edit-post-theme-error" : undefined}
            >
              <NewPostRadioButton
                classname="new-post__radio-btn_type_theme"
                radioBtnValue="Web development"
                radioBtnName="theme"
                idPrefix="edit-post"
                checkValue={themeCheckValue}
                onClick={handleThemeClick}
                labelText="Web development"
              />
              <NewPostRadioButton
                classname="new-post__radio-btn_type_theme"
                radioBtnValue="Web design"
                radioBtnName="theme"
                idPrefix="edit-post"
                checkValue={themeCheckValue}
                onClick={handleThemeClick}
                labelText="Web design"
              />
              <NewPostRadioButton
                classname="new-post__radio-btn_type_theme"
                radioBtnValue="Travel"
                radioBtnName="theme"
                idPrefix="edit-post"
                checkValue={themeCheckValue}
                onClick={handleThemeClick}
                labelText="Travel"
              />
              <NewPostRadioButton
                classname="new-post__radio-btn_type_theme"
                radioBtnValue="Books"
                radioBtnName="theme"
                idPrefix="edit-post"
                checkValue={themeCheckValue}
                onClick={handleThemeClick}
                labelText="Books"
              />
              <NewPostRadioButton
                classname="new-post__radio-btn_type_theme"
                radioBtnValue="Daily life"
                radioBtnName="theme"
                idPrefix="edit-post"
                checkValue={themeCheckValue}
                onClick={handleThemeClick}
                labelText="Daily life"
              />
            </div>
            <span className="new-post__input-error" id="edit-post-theme-error">
              {themeError}
            </span>
          </div>

          <div className="new-post__radio-buttons-container">
            <span className="new-post__input-label" id="edit-post-icon-label">
              Icon
            </span>
            <div className="new-post__icon-selection">
              <button
                type="button"
                className={`new-post__flip-btn new-post__flip-btn_left ${isLeftFlipDisabled && "new-post__flip-btn_disabled"}`}
                onClick={(e) => handleLeftFlip(e, true)}
                disabled={isLeftFlipDisabled}
                aria-label="Previous post icon"
              />
              <div
                ref={iconButtonsRef}
                className="new-post__radio-buttons new-post__radio-buttons_type_icon"
                role="radiogroup"
                aria-labelledby="edit-post-icon-label"
                aria-invalid={iconError ? "true" : undefined}
                aria-describedby={iconError ? "edit-post-icon-error" : undefined}
              >
                {iconButtons.slice(slideStart, slideEnd).map((iconButton) => (
                  <NewPostRadioButton
                    key={iconButton._id}
                    classname={iconButton.class}
                    radioBtnValue={iconButton.buttonValue}
                    radioBtnName={iconButton.name}
                    idPrefix="edit-post"
                    checkValue={iconCheckValue}
                    onClick={handleIconClick}
                    onArrowNavigate={handleIconArrowNavigate}
                    labelText={iconButton.labelText}
                  />
                ))}
              </div>
              <button
                type="button"
                className={`new-post__flip-btn new-post__flip-btn_right ${isRightFlipDisabled && "new-post__flip-btn_disabled"}`}
                onClick={(e) => handleRightFlip(e, true)}
                disabled={isRightFlipDisabled}
                aria-label="Next post icon"
              />
            </div>

            <span className="new-post__input-error" id="edit-post-icon-error">
              {iconError}
            </span>
          </div>

          <div className="new-post__form-section">
            <BlogInput
              placeholder="Title"
              classname="blog-input__field blog-input__field_type_project-title"
              inputType="text"
              inputValue={title}
              onChange={handleTitleChange}
              isSendingReq={isSendingReq}
              error={titleError}
            />
            {hasPhoto ? (
              <div className="new-post__upload-container">
                <button
                  className="new-post__delete-post-photo-btn"
                  onClick={handlePhotoDelete}
                >
                  Delete photo
                </button>
                <ul className="blog-upload-file__info">
                  {photoNames.length > 0 ? (
                    photoNames.map((name) => (
                      <BlogUploadFileInfo key={name} fileName={name} />
                    ))
                  ) : post.photoLink ? (
                    <BlogUploadFileInfo
                      fileName={post.photoLink.slice(
                        post.photoLink.lastIndexOf("/") + 1,
                      )}
                    />
                  ) : (
                    <li className="blog-upload-file__info_empty">
                      {photoInfo}
                    </li>
                  )}
                </ul>
              </div>
            ) : (
              <div className="new-post__upload-container">
                <label className="blog-upload-file">
                  <input
                    name="photoFile"
                    className="blog-upload-file__input"
                    type="file"
                    multiple
                    accept=".jpg"
                    onChange={handlePreuploadPhoto}
                  />
                  <span className="blog-upload-file__btn">
                    <div className="blog-upload-file__icon" />
                    Select photo
                  </span>
                </label>
                <ul className="blog-upload-file__info">
                  {isUploadingPhoto ? (
                    <li className="blog-upload-file__status">
                      Uploading
                      <span className="blog-upload-file__dots" />
                    </li>
                  ) : postPhotos.length === 0 ? (
                    <li className="blog-upload-file__info_empty">
                      {photoInfo}
                    </li>
                  ) : (
                    photoNames.map((n) => (
                      <BlogUploadFileInfo key={n} fileName={n} />
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>

          <BlogInput
            placeholder="Hashtags separated by spaces"
            classname="blog-input__field blog-input__field_type_hashtag"
            inputType="text"
            inputValue={hashtags}
            onChange={handleHashtagsChange}
            isSendingReq={isSendingReq}
            error={hashtagsError}
          />

          <BlogTextArea
            placeholder="Text"
            value={textarea}
            onChange={handleTextareaChange}
            isSendingReq={isSendingReq}
            error={textareaError}
          />
        </BlogForm>
        <BlogCloseButton
          classname="blog-close-btn blog-close-btn_location_new-post-popup"
          onClick={handleClose}
          ariaLabel="Close dialog"
        />
      </div>
    </div>
  );
}

export default EditPostPopup;
