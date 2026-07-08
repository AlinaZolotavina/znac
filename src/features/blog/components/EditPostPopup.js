import { useState, useEffect } from "react";
import BlogForm from "./BlogForm.js";
import BlogInput from "./BlogInput.js";
import BlogCloseButton from "./BlogCloseButton.js";
import NewPostRadioButton from "./NewPostRadioButton.js";
import BlogUploadFileInfo from "./BlogUploadFileInfo.js";
import BlogTextArea from "./BlogTextArea.js";
import iconButtons from "../utils/iconButtons.js";
import hashtagsToInputValue from "../utils/hashtagsToInputValue.js";

function EditPostPopup({ isOpen, onClose, isSendingReq, post, onEditPost }) {
  const [isEdited, setIsEdited] = useState(false);
  const getCurrentIconNumber = (icon) => {
    let currentIconNumber;
    iconButtons.forEach((iconButton) => {
      if (iconButton.buttonValue === icon) {
        currentIconNumber = Number(iconButton._id.substring(2));
      }
    });
    return currentIconNumber;
  };

  useEffect(() => {
    if (Object.keys(post).length !== 0) {
      setThemeCheckValue(post.theme);
      setIconCheckValue(post.icon);

      const currentIconNumber = getCurrentIconNumber(post.icon);

      if (currentIconNumber < 11) {
        setSlideStart(currentIconNumber);
        setSlideEnd(currentIconNumber + 6);
      } else {
        setSlideStart(10);
        setSlideEnd(16);
      }

      setTitle(post.title);
      setHashtags(hashtagsToInputValue(post.hashtags));
      setTextarea(post.text);
      setIsPhotoDeleted(false);
    }
  }, [post, isOpen]);

  const [themeCheckValue, setThemeCheckValue] = useState("");
  const [themeError, setThemeError] = useState("");
  function handleThemeClick(e) {
    setThemeCheckValue(e.target.getAttribute("radiovalue"));
    setIsEdited(true);
  }

  const [iconCheckValue, setIconCheckValue] = useState("");
  const [iconError, setIconError] = useState("");
  function handleIconClick(e) {
    setIconCheckValue(e.target.getAttribute("radiovalue"));
    setIsEdited(true);
  }

  const [slideStart, setSlideStart] = useState(0);
  const [slideEnd, setSlideEnd] = useState(6);
  const [isLeftFlipDisabled, setIsLeftFlipDisabled] = useState(true);
  function handleLeftFlip(e) {
    e.preventDefault();
    if (slideStart > 0) {
      setSlideStart((prev) => prev - 1);
      setSlideEnd((prev) => prev - 1);
    }
  }

  const [isRightFlipDisabled, setIsRightFlipDisabled] = useState(false);
  function handleRightFlip(e) {
    e.preventDefault();
    if (slideEnd < iconButtons.length) {
      setSlideStart((prev) => prev + 1);
      setSlideEnd((prev) => prev + 1);
    }
  }

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
    setPostPhotos([addedPhotos, ...postPhotos]);
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
    const regex = /^[A-Za-zА-Яа-я0-9 _]*$/;
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

  function clearInputs() {
    setThemeCheckValue("");
    setThemeError("");
    setIconCheckValue("");
    setIconError("");
    setSlideStart(0);
    setSlideEnd(6);
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

  return (
    <div
      className={`popup popup_type_get-in-touch ${isOpen && "popup_is-opened"}`}
    >
      <div className="new-post">
        <BlogForm
          formName="new-post"
          formClassname="new-post__form"
          titleClassname="new-post__title"
          title="Edit post"
          buttonClassname="new-post__submit-btn"
          buttonText="Save post"
          isFormValid={isFormValid}
          isSendingReq={isSendingReq}
          onSubmit={handleSubmit}
        >
          <div className="new-post__radio-buttons-container">
            <span className="new-post__input-label">Theme</span>
            <div className="new-post__radio-buttons new-post__radio-buttons_type_theme">
              <NewPostRadioButton
                classname="new-post__radio-btn_type_theme"
                radioBtnValue="Web development"
                radioBtnName="theme"
                checkValue={themeCheckValue}
                onClick={handleThemeClick}
                labelText="Web development"
              />
              <NewPostRadioButton
                classname="new-post__radio-btn_type_theme"
                radioBtnValue="Web design"
                radioBtnName="theme"
                checkValue={themeCheckValue}
                onClick={handleThemeClick}
                labelText="Web design"
              />
              <NewPostRadioButton
                classname="new-post__radio-btn_type_theme"
                radioBtnValue="Travel"
                radioBtnName="theme"
                checkValue={themeCheckValue}
                onClick={handleThemeClick}
                labelText="Travel"
              />
              <NewPostRadioButton
                classname="new-post__radio-btn_type_theme"
                radioBtnValue="Books"
                radioBtnName="theme"
                checkValue={themeCheckValue}
                onClick={handleThemeClick}
                labelText="Books"
              />
              <NewPostRadioButton
                classname="new-post__radio-btn_type_theme"
                radioBtnValue="Daily life"
                radioBtnName="theme"
                checkValue={themeCheckValue}
                onClick={handleThemeClick}
                labelText="Daily life"
              />
            </div>
            <span className="new-post__input-error">{themeError}</span>
          </div>

          <div className="new-post__radio-buttons-container">
            <span className="new-post__input-label">Icon</span>
            <div className="new-post__icon-selection">
              <button
                className={`new-post__flip-btn new-post__flip-btn_left ${isLeftFlipDisabled && "new-post__flip-btn_disabled"}`}
                onClick={handleLeftFlip}
                disabled={isLeftFlipDisabled}
              />
              <div className="new-post__radio-buttons new-post__radio-buttons_type_icon">
                {iconButtons.slice(slideStart, slideEnd).map((iconButton) => (
                  <NewPostRadioButton
                    key={iconButton._id}
                    classname={iconButton.class}
                    radioBtnValue={iconButton.buttonValue}
                    radioBtnName={iconButton.name}
                    checkValue={iconCheckValue}
                    onClick={handleIconClick}
                    labelText={iconButton.labelText}
                  />
                ))}
              </div>
              <button
                className={`new-post__flip-btn new-post__flip-btn_right ${isRightFlipDisabled && "new-post__flip-btn_disabled"}`}
                onClick={handleRightFlip}
                disabled={isRightFlipDisabled}
              />
            </div>

            <span className="new-post__input-error">{iconError}</span>
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
        />
      </div>
    </div>
  );
}

export default EditPostPopup;
