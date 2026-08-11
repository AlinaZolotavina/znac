import { useRef } from "react";
import successIcon from "../assets/success-icon.svg";
import EmailSentIcon from "../assets/email-sent-icon.svg";
import failureIcon from "../assets/failure-icon.svg";
import useCloseOnEsc from "../../shared/hooks/useCloseOnEsc";
import useOverlayClickClose from "../../shared/hooks/useOverlayClickClose";
import useInitialFocus from "../../shared/hooks/useInitialFocus";
import useFocusTrap from "../../shared/hooks/useFocusTrap";
import useReturnFocus from "../../shared/hooks/useReturnFocus";
import useLockBodyScroll from "../../shared/hooks/useLockBodyScroll";

function Modal({ isOpen, status, type, message, onClose }) {
  const modalRef = useRef(null);

  useReturnFocus(isOpen);
  useInitialFocus(isOpen, modalRef);
  useFocusTrap(isOpen, modalRef);
  useCloseOnEsc(isOpen, onClose);
  useLockBodyScroll(isOpen);

  const handleOverlayClickClose = useOverlayClickClose(isOpen, onClose);

  if (!isOpen) return null;

  const icons = {
    success: {
      default: successIcon,
      email: EmailSentIcon,
    },
    error: {
      default: failureIcon,
    },
  };

  const icon = status && icons[status]?.[type || "default"];

  return (
    <div
      className="popup popup_is-opened"
      onMouseDown={handleOverlayClickClose}
    >
      <div
        ref={modalRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        {status && icon && (
          <img
            className="modal__icon"
            src={icon}
            alt={`${message || "Status"} icon`}
          />
        )}

        <h2 id="modal-title" className="modal__message">
          {message}
        </h2>

        <button
          className="close-btn popup__close-btn"
          onClick={onClose}
          aria-label="Close dialog"
        />
      </div>
    </div>
  );
}
export default Modal;
