import successIcon from "../assets/success-icon.svg";
import EmailSentIcon from "../assets/email-sent-icon.svg";
import failureIcon from "../assets/failure-icon.svg";

function Modal({ isOpen, status, type, message, onClose }) {
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
    <div className="popup popup_is-opened">
      <div className="modal">
        {status && icon && (
          <img className="modal__icon" src={icon} alt="icon" />
        )}

        <h2 className="modal__message">{message}</h2>

        <button className="close-btn popup__close-btn" onClick={onClose} />
      </div>
    </div>
  );
}
export default Modal;
