import { useContext, useEffect, useRef, useState } from "react";
import Form from "../../../app/components/Form";
import Input from "../../../app/components/Input";
import CloseButton from "../../../app/components/CloseButton";
import { CurrentUserContext } from "../../../contexts/CurrentUserContext";
import useInitialFocus from "../../../shared/hooks/useInitialFocus";
import useFocusTrap from "../../../shared/hooks/useFocusTrap";
import useReturnFocus from "../../../shared/hooks/useReturnFocus";
import useCloseOnEsc from "../../../shared/hooks/useCloseOnEsc";
import useLockBodyScroll from "../../../shared/hooks/useLockBodyScroll";
import useOverlayClickClose from "../../../shared/hooks/useOverlayClickClose";

function EditEmailModal({
  isOpen,
  onClose,
  isSendingReq,
  onRequestEmailChange,
}) {
  const currentUser = useContext(CurrentUserContext);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  function handleEmailChange(e) {
    const emailRegex =
      /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/i;
    const isEmailValid = emailRegex.test(e.target.value);
    if (!isEmailValid) {
      setEmailError("Please enter a valid e-mail");
    } else if (e.target.value === currentUser.email) {
      setEmailError("This email is currently in use");
    } else {
      setEmailError("");
    }
    setEmail(e.target.value);
  }
  function handleSubmit(e) {
    e.preventDefault();
    onRequestEmailChange({ email: email });
  }

  const [isFormValid, setIsFormValid] = useState(false);
  useEffect(() => {
    if (email && !emailError) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [email, emailError]);

  function handleClose() {
    setEmail("");
    setEmailError("");
    onClose();
  }

  const modalRef = useRef(null);

  useReturnFocus(isOpen);
  useInitialFocus(isOpen, modalRef);
  useFocusTrap(isOpen, modalRef);
  useCloseOnEsc(isOpen, handleClose);
  useLockBodyScroll(isOpen);

  const handleOverlayClickClose = useOverlayClickClose(isOpen, handleClose);

  if (!isOpen) return null;

  return (
    <div
      className="popup popup_type_photo popup_is-opened"
      onMouseDown={handleOverlayClickClose}
    >
      <div
        ref={modalRef}
        className="popup__container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-email-title"
        tabIndex={-1}
      >
        <Form
          formName="request-email-change"
          formClassname="popup__form"
          titleClassname="popup__title"
          titleId="edit-email-title"
          title="Edit e-mail"
          buttonClassname="popup__submit-btn"
          buttonText="Request an email change"
          isFormValid={isFormValid}
          isSendingReq={isSendingReq}
          onSubmit={handleSubmit}
        >
          <Input
            inputLabel=""
            placeholder="Enter new e-mail"
            classname="popup__input-field"
            inputType="text"
            inputValue={email}
            onChange={handleEmailChange}
            isSendingReq={isSendingReq}
            error={emailError}
            inputName="new email"
          />
        </Form>
        <CloseButton
          classname="close-btn popup__close-btn"
          onClick={handleClose}
          ariaLabel="Close dialog"
        />
      </div>
    </div>
  );
}

export default EditEmailModal;
