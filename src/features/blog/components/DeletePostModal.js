import { useRef } from "react";
import Form from "./BlogForm";
import CloseButton from "./BlogCloseButton";
import useInitialFocus from "../../../shared/hooks/useInitialFocus";
import useFocusTrap from "../../../shared/hooks/useFocusTrap";
import useReturnFocus from "../../../shared/hooks/useReturnFocus";
import useCloseOnEsc from "../../../shared/hooks/useCloseOnEsc";
import useLockBodyScroll from "../../../shared/hooks/useLockBodyScroll";
import useOverlayClickClose from "../../../shared/hooks/useOverlayClickClose";

function DeletePostModal({ post, isOpen, onClose, onDeletePost }) {
    const modalRef = useRef(null);

    useReturnFocus(isOpen);
    useInitialFocus(isOpen, modalRef);
    useFocusTrap(isOpen, modalRef);
    useCloseOnEsc(isOpen, onClose);
    useLockBodyScroll(isOpen);

    const handleOverlayClickClose = useOverlayClickClose(isOpen, onClose);

    function handlePostDelete(e) {
        e.preventDefault();
        onDeletePost(post);
    }

    if (!isOpen) return null;

    return (
        <div
            className='popup popup_type_delete-post popup_is-opened'
            onMouseDown={handleOverlayClickClose}
        >
            <div
                ref={modalRef}
                className="popup__container"
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-post-title"
                tabIndex={-1}
            >
                <Form
                    formName='delete-post'
                    formClassname='popup__form'
                    titleClassname='popup__title'
                    titleId='delete-post-title'
                    title='Are you sure you want to delete the post?'
                    buttonClassname='popup__submit-btn delete-post-submit-btn'
                    buttonText='Delete'
                    isFormValid={true}
                    isSendingReq={false}
                    onSubmit={handlePostDelete}

                />
                <CloseButton classname="close-btn popup__close-btn" onClick={onClose} ariaLabel="Close dialog"/>
            </div>
        </div>
    );
}

export default DeletePostModal;
