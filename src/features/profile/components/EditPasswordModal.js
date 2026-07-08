import { useEffect, useState } from "react";
import Form from "../../../app/components/Form";
import Input from "../../../app/components/Input";
import CloseButton from "../../../app/components/CloseButton";

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

  return (
    <div className={`popup popup_type_photo ${isOpen && "popup_is-opened"}`}>
      <div className="popup__container">
        <Form
          formName="request-password-change"
          formClassname="popup__form"
          titleClassname="popup__title"
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
        />
      </div>
    </div>
  );
}

export default EditPasswordModal;
