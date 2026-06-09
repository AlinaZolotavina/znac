/* eslint-disable no-useless-escape */
import { useState, useEffect } from "react";
import BlogForm from "./BlogForm";
import BlogInput from "./BlogInput";
import BlogCloseButton from "./BlogCloseButton";
import BlogTextArea from "./BlogTextArea";

function NewProjectPopup({ isOpen, onClose, onAddProject, isSendingReq }) {
  const [projectTitle, setProjectTitle] = useState("");
  const [projectTitleError, setProjectTitleError] = useState("");
  function handleProjectTitleChange(e) {
    const regex = /^[A-Za-zА-Яа-я0-9 _\"\'-]*$/;
    if (e.target.value.length === 0) {
      setProjectTitleError("Title is required");
    } else if (!regex.test(e.target.value)) {
      setProjectTitleError(
        "Only letters, numbers, quotes and underscores are allowed",
      );
    } else {
      setProjectTitleError("");
    }
    setProjectTitle(e.target.value);
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
  }

  const [projectLink, setProjectLink] = useState("");
  const [projectLinkError, setProjectLinkError] = useState("");
  function handleProjectLinkChange(e) {
    // eslint-disable-next-line no-useless-escape
    const regex =
      /^(https?:\/\/)(w{3})?([\da-z\.\-]+)\.([a-z\.]{2,6})([\w\.\-\_%~:\/?#\[\]@!$&\'()*\+,;=])*#?\/?$/;
    if (!regex.test(e.target.value) && e.target.value.length !== 0) {
      setProjectLinkError("Invalid url");
    } else if (e.target.value.length === 0) {
      setProjectLinkError("You missed this field");
    } else {
      setProjectLinkError("");
    }
    setProjectLink(e.target.value);
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
      !projectLinkError
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
    onAddProject({
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
          title="New project"
          buttonClassname="new-project__submit-btn"
          buttonText="Add project"
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
            inputName="project title"
          />
          <BlogInput
            placeholder="Hashtags separated by spaces"
            classname="blog-input__field blog-input___fieldtype_project-hashtags"
            inputType="text"
            inputValue={projectHashtags}
            onChange={handleProjectHashtagsChange}
            isSendingReq={isSendingReq}
            error={projectHashtagsError}
            inputName="project hashtags"
          />
          <BlogTextArea
            placeholder="Project description"
            value={textarea}
            onChange={handleTextareaChange}
            isSendingReq={isSendingReq}
            error={textareaError}
            inputName="project description"
          />
          <BlogInput
            placeholder="Link to the project"
            classname="blog-input__field blog-input___fieldtype_project-link"
            inputType="url"
            inputValue={projectLink}
            onChange={handleProjectLinkChange}
            isSendingReq={isSendingReq}
            error={projectLinkError}
            inputName="project link"
          />
        </BlogForm>
        <BlogCloseButton
          classname="blog-close-btn blog-close-btn_location_new-project-popup"
          onClick={handleClose}
        />
      </div>
    </div>
  );
}

export default NewProjectPopup;
