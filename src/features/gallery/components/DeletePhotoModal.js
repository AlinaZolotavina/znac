import { useRef } from "react";
import Form from "../../../app/components/Form";
import CloseButton from "../../../app/components/CloseButton";
import useInitialFocus from "../../../shared/hooks/useInitialFocus";
import useFocusTrap from "../../../shared/hooks/useFocusTrap";
import useReturnFocus from "../../../shared/hooks/useReturnFocus";
import useCloseOnEsc from "../../../shared/hooks/useCloseOnEsc";
import useLockBodyScroll from "../../../shared/hooks/useLockBodyScroll";
import useOverlayClickClose from "../../../shared/hooks/useOverlayClickClose";

function DeletePhotoModal({ photo, isOpen, onClose, onDeletePhoto }) {
  const modalRef = useRef(null);

  useReturnFocus(isOpen);
  useInitialFocus(isOpen, modalRef);
  useFocusTrap(isOpen, modalRef);
  useCloseOnEsc(isOpen, onClose);
  useLockBodyScroll(isOpen);

  const handleOverlayClickClose = useOverlayClickClose(isOpen, onClose);

  function handlePhotoDelete(e) {
    e.preventDefault();
    onDeletePhoto(photo);
  }

  if (!isOpen) return null;

  return (
    <div
      className="popup popup_type_delete-photo popup_is-opened"
      onMouseDown={handleOverlayClickClose}
    >
      <div
        ref={modalRef}
        className="popup__container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-photo-title"
        tabIndex={-1}
      >
        <Form
          formName="delete-photo"
          formClassname="popup__form"
          titleClassname="popup__title"
          titleId="delete-photo-title"
          title="Are you sure you want to delete the photo?"
          buttonClassname="popup__submit-btn"
          buttonText="Delete"
          isFormValid={true}
          isSendingReq={false}
          onSubmit={handlePhotoDelete}
        />
        <CloseButton
          classname="close-btn popup__close-btn"
          onClick={onClose}
          ariaLabel="Close dialog"
        />
      </div>
    </div>
  );
}

export default DeletePhotoModal;
