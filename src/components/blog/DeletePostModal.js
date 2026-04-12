import Form from "./BlogForm";
import CloseButton from "./BlogCloseButton";

function DeletePostModal({ post, isOpen, onClose, onDeletePost }) {
    function handlePostDelete(e) {
        e.preventDefault();
        onDeletePost(post);
    }
    return (
        <div className={`popup popup_type_delete-post ${isOpen && 'popup_is-opened'}`}>
            <div className="popup__container">
                <Form
                    formName='delete-post'
                    formClassname='popup__form'
                    titleClassname='popup__title'
                    title='Are you sure you want to delete the post?'
                    buttonClassname='popup__submit-btn delete-post-submit-btn'
                    buttonText='Delete'
                    isFormValid={true}
                    isSendingReq={false}
                    onSubmit={handlePostDelete}

                />
                <CloseButton classname="close-btn popup__close-btn" onClick={onClose}/>
            </div>
        </div>
    );
}

export default DeletePostModal;