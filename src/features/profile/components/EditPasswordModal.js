import { useEffect, useRef, useState } from "react";
import Form from "../../../app/components/Form";
import Input from "../../../app/components/Input";
import CloseButton from "../../../app/components/CloseButton";
import useInitialFocus from "../../../shared/hooks/useInitialFocus";
import useFocusTrap from "../../../shared/hooks/useFocusTrap";
import useReturnFocus from "../../../shared/hooks/useReturnFocus";
import useCloseOnEsc from "../../../shared/hooks/useCloseOnEsc";
import useLockBodyScroll from "../../../shared/hooks/useLockBodyScroll";
import useOverlayClickClose from "../../../shared/hooks/useOverlayClickClose";

function EditPasswordModal({
  isOpen,
  onClose,
  isSendingReq,
  onUpdatePassword,
}) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");

  const [isFormValid, setIsFormValid] = useState(false);

  function handleOldPasswordChange(e) {
    setOldPassword(e.target.value);

    if (!e.target.value) {
      setOldPasswordError("Enter current password");
    } else {
      setOldPasswordError("");
    }
  }

  function handleNewPasswordChange(e) {
    const value = e.target.value;

    setNewPassword(value);

    if (value.length < 8) {
      setNewPasswordError("Password must contain at least 8 characters");
    } else {
      setNewPasswordError("");
    }
  }

  useEffect(() => {
    if (oldPassword && newPassword && !oldPasswordError && !newPasswordError) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [oldPassword, newPassword, oldPasswordError, newPasswordError]);

  function handleSubmit(e) {
    e.preventDefault();

    onUpdatePassword({
      oldPassword,
      newPassword,
    });
  }

  function handleClose() {
    setOldPassword("");
    setNewPassword("");
    setOldPasswordError("");
    setNewPasswordError("");
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
        aria-labelledby="edit-password-title"
        tabIndex={-1}
      >
        <Form
          formName="request-password-change"
          formClassname="popup__form"
          titleClassname="popup__title"
          titleId="edit-password-title"
          title="Edit password"
          buttonClassname="popup__submit-btn"
          buttonText="Change password"
          isFormValid={isFormValid}
          isSendingReq={isSendingReq}
          onSubmit={handleSubmit}
        >
          <Input
            inputLabel=""
            placeholder="Enter current password"
            classname="popup__input-field"
            inputType="password"
            inputValue={oldPassword}
            onChange={handleOldPasswordChange}
            isSendingReq={isSendingReq}
            error={oldPasswordError}
            inputName="oldPassword"
          />

          <Input
            inputLabel=""
            placeholder="Enter new password"
            classname="popup__input-field"
            inputType="password"
            inputValue={newPassword}
            onChange={handleNewPasswordChange}
            isSendingReq={isSendingReq}
            error={newPasswordError}
            inputName="newPassword"
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

export default EditPasswordModal;
