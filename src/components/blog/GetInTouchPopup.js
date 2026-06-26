import Social from "./Social";
import BlogForm from "./BlogForm";
import BlogInput from "./BlogInput";
import { useState, useEffect } from "react";
import BlogCloseButton from "./BlogCloseButton";

function GetInTouchPopup({ isOpen, isSendingReq, onClose, onSubmit }) {
  const [visitorName, setVisitorName] = useState("");
  const [visitorNameError, setVisitorNameError] = useState("");
  function handleVisitorNameChange(e) {
    const regex = /^[A-Za-zА-Яа-яЁё -]*$/;
    if (e.target.value.length === 0) {
      setVisitorNameError("Name is required");
    } else if (!regex.test(e.target.value)) {
      setVisitorNameError("Only letters are allowed");
    } else {
      setVisitorNameError("");
    }
    setVisitorName(e.target.value);
  }

  const [visitorEmail, setVisitorEmail] = useState("");
  const [visitorEmailError, setVisitorEmailError] = useState("");
  function handleVisitorEmailChange(e) {
    const emailRegex =
      /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/i;
    const isEmailValid = emailRegex.test(e.target.value);
    if (!isEmailValid) {
      setVisitorEmailError("Please enter a valid e-mail");
    } else {
      setVisitorEmailError("");
    }
    setVisitorEmail(e.target.value);
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
      visitorEmail &&
      visitorName &&
      !visitorEmailError &&
      !visitorNameError &&
      textarea &&
      !textareaError
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [
    visitorEmail,
    visitorName,
    visitorEmailError,
    visitorNameError,
    textarea,
    textareaError,
  ]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isFormValid || isSendingReq) {
      return;
    }

    const sent = await onSubmit({
      name: visitorName.trim(),
      email: visitorEmail.trim(),
      message: textarea.trim(),
    });

    if (sent) {
      resetForm();
      onClose();
    }
  }

  function resetForm() {
    setVisitorName("");
    setVisitorNameError("");
    setVisitorEmail("");
    setVisitorEmailError("");
    setTextarea("");
    setTextareaError("");
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  return (
    <div
      className={`popup popup_type_get-in-touch ${isOpen && "popup_is-opened"}`}
    >
      <div className="get-in-touch">
        <div className="get-in-touch__icons">
          <div className="get-in-touch__icon" />
          <Social classname="get-in-touch" />
        </div>
        <BlogForm
          formName="get-in-touch"
          formClassname="get-in-touch__form"
          titleClassname="get-in-touch__title"
          title="Get in touch"
          buttonClassname="get-in-touch__submit-btn"
          buttonText="Send"
          isFormValid={isFormValid}
          isSendingReq={isSendingReq}
          onSubmit={handleSubmit}
        >
          <BlogInput
            placeholder="Name"
            classname="blog-input__field blog-input__field_type_visitor-name"
            inputType="text"
            inputValue={visitorName}
            onChange={handleVisitorNameChange}
            isSendingReq={isSendingReq}
            error={visitorNameError}
            inputName="get-in-touch name"
            maxLength={80}
          />
          <BlogInput
            placeholder="Email"
            classname="blog-input__field blog-input___fieldtype_visitor-email"
            inputType="text"
            inputValue={visitorEmail}
            onChange={handleVisitorEmailChange}
            isSendingReq={isSendingReq}
            error={visitorEmailError}
            inputName="get-in-touch email"
            maxLength={254}
          />
          <label className="blog-input">
            <textarea
              className="blog-input__field blog-input__field_type_text-area"
              placeholder="Your message"
              value={textarea}
              onChange={handleTextareaChange}
              required
              disabled={isSendingReq}
              name="get-in-touch text"
              maxLength="3000"
            />
            <span className="blog-input__error">{textareaError}</span>
          </label>
        </BlogForm>
        <BlogCloseButton classname="blog-close-btn" onClick={handleClose} />
      </div>
    </div>
  );
}

export default GetInTouchPopup;
