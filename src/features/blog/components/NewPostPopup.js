import { useState, useEffect, useRef, useCallback } from "react";
import BlogForm from "./BlogForm.js";
import BlogInput from "./BlogInput.js";
import BlogCloseButton from "./BlogCloseButton.js";
import NewPostRadioButton from "./NewPostRadioButton.js";
import BlogUploadFileInfo from "./BlogUploadFileInfo.js";
import BlogTextArea from "./BlogTextArea.js";
import iconButtons from "../utils/iconButtons.js";
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

function NewPostPopup({ isOpen, onClose, isSendingReq, onAddPost }) {
  const [themeCheckValue, setThemeCheckValue] = useState("");
  const [themeError, setThemeError] = useState("");
  function handleThemeClick(value) {
    setThemeCheckValue(value);
  }

  const [iconCheckValue, setIconCheckValue] = useState("");
  const [iconError, setIconError] = useState("");
  function handleIconClick(value) {
    setIconCheckValue(value);
  }

  const [slideStart, setSlideStart] = useState(0);
  const iconButtonsRef = useRef(null);
  const iconFocusAfterSlideRef = useRef("");
  const [visibleIconsCount, setVisibleIconsCount] = useState(() =>
    getVisibleCount(window.innerWidth),
  );
  const slideEnd = Math.min(slideStart + visibleIconsCount, iconButtons.length);
  const [isLeftFlipDisabled, setIsLeftFlipDisabled] = useState(true);

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
    function handleResize() {
      const count = getVisibleCount(
        window.innerWidth,
        iconButtonsRef.current?.clientWidth,
      );
      const lastSlideStart = Math.max(iconButtons.length - count, 0);

      setVisibleIconsCount(count);
      setSlideStart((prev) => Math.min(prev, lastSlideStart));
    }

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (slideStart === 0) {
      setIsLeftFlipDisabled(true);
    } else {
      setIsLeftFlipDisabled(false);
    }
    if (slideEnd === iconButtons.length) {
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
  }

  const [postPhotos, setPostPhotos] = useState([]);
  const [photoNames, setPhotoNames] = useState([]);
  const fileInputRef = useRef(null);
  const [uploadError, setUploadError] = useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const uploadStatusMessage = isUploadingPhoto ? "Uploading" : "";

  async function handlePreuploadPhoto(e) {
    setUploadError("");
    setIsUploadingPhoto(true);
    const addedPhotos = [];
    const names = [];

    try {
      const files = Array.from(e.target.files);

      for (const item of files) {
        const fileName = item.name.slice(0, -4);
        const webPFile = await convert(item, fileName);
        names.push(`${fileName}.jpg`);
        addedPhotos.push(webPFile);
      }

      setPostPhotos(addedPhotos);
      setPhotoNames(names);
    } finally {
      setIsUploadingPhoto(false);
    }
  }

  function handlePhotoDelete(e) {
    e.preventDefault();
    setPostPhotos([]);
    setPhotoNames([]);
    setUploadError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const convert = (jpgFile, fileName) => {
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
      !textareaError
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
  ]);

  function handleSubmit(e) {
    e.preventDefault();

    onAddPost({
      theme: themeCheckValue,
      icon: iconCheckValue,
      title,
      photoData: postPhotos,
      hashtags,
      text: textarea,
      setUploadError,
    });
  }

  function handleClose() {
    onClose();
  }

  const popupRef = useRef(null);

  useReturnFocus(isOpen);
  useInitialFocus(isOpen, popupRef);
  useFocusTrap(isOpen, popupRef);
  useCloseOnEsc(isOpen, handleClose);
  useLockBodyScroll(isOpen);

  const handleOverlayClickClose = useOverlayClickClose(isOpen, handleClose);

  const clearInputs = useCallback(() => {
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
    setPhotoNames([]);
    setUploadError("");
    setHashtags("");
    setHashtagsError("");
    setTextarea("");
    setTextareaError("");
    setIsFormValid(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsUploadingPhoto(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      clearInputs();
    }
  }, [isOpen, clearInputs]);

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
        aria-labelledby="new-post-title"
        tabIndex={-1}
      >
        <BlogForm
          formName="new-post"
          formClassname="new-post__form"
          titleClassname="new-post__title"
          titleId="new-post-title"
          title="New post"
          buttonClassname="new-post__submit-btn"
          buttonText="Add post"
          isFormValid={isFormValid}
          isSendingReq={isSendingReq}
          onSubmit={handleSubmit}
        >
          <div className="new-post__radio-buttons-container">
            <span className="new-post__input-label" id="new-post-theme-label">
              Theme
            </span>
            <div
              className="new-post__radio-buttons new-post__radio-buttons_type_theme"
              role="radiogroup"
              aria-labelledby="new-post-theme-label"
              aria-invalid={themeError ? "true" : undefined}
              aria-describedby={themeError ? "new-post-theme-error" : undefined}
            >
              <NewPostRadioButton
                classname="new-post__radio-btn_type_theme"
                radioBtnValue="Web development"
                radioBtnName="theme"
                idPrefix="new-post"
                checkValue={themeCheckValue}
                onClick={handleThemeClick}
                labelText="Web development"
              />
              <NewPostRadioButton
                classname="new-post__radio-btn_type_theme"
                radioBtnValue="Web design"
                radioBtnName="theme"
                idPrefix="new-post"
                checkValue={themeCheckValue}
                onClick={handleThemeClick}
                labelText="Web design"
              />
              <NewPostRadioButton
                classname="new-post__radio-btn_type_theme"
                radioBtnValue="Travel"
                radioBtnName="theme"
                idPrefix="new-post"
                checkValue={themeCheckValue}
                onClick={handleThemeClick}
                labelText="Travel"
              />
              <NewPostRadioButton
                classname="new-post__radio-btn_type_theme"
                radioBtnValue="Books"
                radioBtnName="theme"
                idPrefix="new-post"
                checkValue={themeCheckValue}
                onClick={handleThemeClick}
                labelText="Books"
              />
              <NewPostRadioButton
                classname="new-post__radio-btn_type_theme"
                radioBtnValue="Daily life"
                radioBtnName="theme"
                idPrefix="new-post"
                checkValue={themeCheckValue}
                onClick={handleThemeClick}
                labelText="Daily life"
              />
            </div>
            <span className="new-post__input-error" id="new-post-theme-error">
              {themeError}
            </span>
          </div>

          <div className="new-post__radio-buttons-container">
            <span className="new-post__input-label" id="new-post-icon-label">
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
                aria-labelledby="new-post-icon-label"
                aria-invalid={iconError ? "true" : undefined}
                aria-describedby={iconError ? "new-post-icon-error" : undefined}
              >
                {iconButtons.slice(slideStart, slideEnd).map((iconButton) => (
                  <NewPostRadioButton
                    key={iconButton._id}
                    classname={iconButton.class}
                    radioBtnValue={iconButton.buttonValue}
                    radioBtnName={iconButton.name}
                    idPrefix="new-post"
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

            <span className="new-post__input-error" id="new-post-icon-error">
              {iconError}
            </span>
          </div>

          <div className="new-post__form-section">
            <BlogInput
              placeholder="Title"
              classname="blog-input__field blog-input__field_type_post-title"
              inputType="text"
              inputValue={title}
              onChange={handleTitleChange}
              isSendingReq={isSendingReq}
              error={titleError}
              inputName="post title"
            />
            <div className="new-post__upload-container">
              <div className="visually-hidden" role="status">
                {uploadStatusMessage}
              </div>
              <div className="visually-hidden" role="alert">
                {uploadError}
              </div>
              {postPhotos.length > 0 ? (
                <button
                  type="button"
                  className="new-post__delete-post-photo-btn"
                  onClick={handlePhotoDelete}
                >
                  Delete photo
                </button>
              ) : (
                <label className="blog-upload-file">
                  <input
                    ref={fileInputRef}
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
              )}
              <ul className="blog-upload-file__info">
                {isUploadingPhoto ? (
                  <li className="blog-upload-file__status">
                    Uploading
                    <span className="blog-upload-file__dots" />
                  </li>
                ) : uploadError ? (
                  <li className="blog-upload-file__info_empty">
                    {uploadError}
                  </li>
                ) : postPhotos.length === 0 ? (
                  <li className="blog-upload-file__info_empty">Not selected</li>
                ) : (
                  photoNames.map((n) => (
                    <BlogUploadFileInfo key={n} fileName={n} />
                  ))
                )}
              </ul>
            </div>
          </div>

          <BlogInput
            placeholder="Hashtags separated by spaces"
            classname="blog-input__field blog-input__field_type_hashtag"
            inputType="text"
            inputValue={hashtags}
            onChange={handleHashtagsChange}
            isSendingReq={isSendingReq}
            error={hashtagsError}
            inputName="post hashtags"
          />

          <BlogTextArea
            placeholder="Text"
            value={textarea}
            onChange={handleTextareaChange}
            isSendingReq={isSendingReq}
            error={textareaError}
            inputName="post text"
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

export default NewPostPopup;
