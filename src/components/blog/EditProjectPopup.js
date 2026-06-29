import { useState, useEffect } from "react";
import BlogForm from "./BlogForm";
import BlogInput from "./BlogInput";
import BlogCloseButton from "./BlogCloseButton";
import BlogTextArea from "./BlogTextArea";
import isValidUrl from "../../utils/isValidUrl";
import hashtagsToInputValue from "../../utils/hashtagsToInputValue";

function EditProjectPopup({
  isOpen,
  onClose,
  project,
  onEditProject,
  isSendingReq,
}) {
  const [isEdited, setIsEdited] = useState(false);
  useEffect(() => {
    if (Object.keys(project).length !== 0) {
      setProjectTitle(project.title);
      setProjectHashtags(hashtagsToInputValue(project.hashtags));
      setTextarea(project.text);
      setProjectLink(project.link);
    }
  }, [project, isOpen]);

  const [projectTitle, setProjectTitle] = useState("");
  const [projectTitleError, setProjectTitleError] = useState("");
  function handleProjectTitleChange(e) {
    const regex = /^[\p{L}0-9 _()\-:!?]*$/u;
    if (e.target.value.length === 0) {
      setProjectTitleError("Title is required");
    } else if (!regex.test(e.target.value)) {
      setProjectTitleError(
        "Only letters, numbers, spaces and _()-:!? are allowed",
      );
    } else {
      setProjectTitleError("");
    }
    setProjectTitle(e.target.value);
    setIsEdited(true);
  }

  const [projectHashtags, setProjectHashtags] = useState("");
  const [projectHashtagsError, setProjectHashtagsError] = useState("");
  function handleProjectHashtagsChange(e) {
    const regex = /^[A-Za-zА-Яа-я0-9 _.]*$/;
    if (e.target.value.length === 0) {
      setProjectHashtagsError("You must add at least one hashtag");
    } else if (!regex.test(e.target.value)) {
      setProjectHashtagsError(
        "Only letters, numbers, underscores and dots are allowed",
      );
    } else {
      setProjectHashtagsError("");
    }
    setProjectHashtags(e.target.value);
    setIsEdited(true);
  }

  const [textarea, setTextarea] = useState("");
  const [textareaError, setTextareaError] = useState("");
  function handleTextareaChange(e) {
    if (e.target.value.length === 0) {
      setTextareaError("Please describe your project");
    } else {
      setTextareaError("");
    }
    setTextarea(e.target.value);
    setIsEdited(true);
  }

  const [projectLink, setProjectLink] = useState("");
  const [projectLinkError, setProjectLinkError] = useState("");
  function handleProjectLinkChange(e) {
    const value = e.target.value.trim();

    if (!value) {
      setProjectLinkError("You missed this field");
    } else if (!isValidUrl(value)) {
      setProjectLinkError("Invalid URL");
    } else {
      setProjectLinkError("");
    }

    setProjectLink(value);
    setIsEdited(true);
  }

  const [isFormValid, setIsFormValid] = useState(false);
  useEffect(() => {
    if (
      projectTitle &&
      projectHashtags &&
      textarea &&
      projectLink &&
      !projectTitleError &&
      !projectHashtagsError &&
      !textareaError &&
      !projectLinkError &&
      isEdited
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [
    projectTitle,
    projectHashtags,
    textarea,
    projectLink,
    projectTitleError,
    projectHashtagsError,
    textareaError,
    projectLinkError,
  ]);

  function handleSubmit(e) {
    e.preventDefault();
    const modifiedTextarea = textarea.replace(/(\r\n|\n|\r)/gm, "");
    onEditProject(project._id, {
      title: projectTitle,
      hashtags: projectHashtags.toLowerCase(),
      text: modifiedTextarea,
      link: projectLink,
    });
    clearInputs();
  }

  function clearInputs() {
    setProjectTitle("");
    setProjectTitleError("");
    setProjectHashtags("");
    setProjectHashtagsError("");
    setTextarea("");
    setTextareaError("");
    setProjectLink("");
    setProjectLinkError("");
    setIsEdited(false);
  }

  function handleClose() {
    clearInputs();
    onClose();
  }

  return (
    <div
      className={`popup popup_type_get-in-touch ${isOpen && "popup_is-opened"}`}
    >
      <div className="new-project">
        <BlogForm
          formName="new-project"
          formClassname="new-project__form"
          titleClassname="new-project__title"
          title="Edit project"
          buttonClassname="new-project__submit-btn"
          buttonText="Save changes"
          isFormValid={isFormValid}
          isSendingReq={isSendingReq}
          onSubmit={handleSubmit}
        >
          <BlogInput
            placeholder="Title"
            classname="blog-input__field blog-input__field_type_project-title"
            inputType="text"
            inputValue={projectTitle}
            onChange={handleProjectTitleChange}
            isSendingReq={isSendingReq}
            error={projectTitleError}
          />
          <BlogInput
            placeholder="Hashtags separated by spaces"
            classname="blog-input__field blog-input___fieldtype_project-hashtags"
            inputType="text"
            inputValue={projectHashtags}
            onChange={handleProjectHashtagsChange}
            isSendingReq={isSendingReq}
            error={projectHashtagsError}
          />
          <BlogTextArea
            placeholder="Project description"
            value={textarea}
            onChange={handleTextareaChange}
            isSendingReq={isSendingReq}
            error={textareaError}
          />
          <BlogInput
            placeholder="Link to the project"
            classname="blog-input__field blog-input___fieldtype_project-link"
            inputType="url"
            inputValue={projectLink}
            onChange={handleProjectLinkChange}
            isSendingReq={isSendingReq}
            error={projectLinkError}
          />
        </BlogForm>
        <BlogCloseButton classname="blog-close-btn" onClick={handleClose} />
      </div>
    </div>
  );
}

export default EditProjectPopup;
