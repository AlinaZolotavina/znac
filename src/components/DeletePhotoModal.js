import Form from "./Form";
import CloseButton from "./CloseButton";

function DeletePhotoModal({ photo, isOpen, onClose, onDeletePhoto }) {
    function handlePhotoDelete(e) {
        e.preventDefault();
        onDeletePhoto(photo);
    }
    return (
        <div className={`popup popup_type_delete-photo ${isOpen && 'popup_is-opened'}`}>
            <div className="popup__container">
                <Form
                    formName='delete-photo'
                    formClassname='popup__form'
                    titleClassname='popup__title'
                    title='Are you sure you want to delete the photo?'
                    buttonClassname='popup__submit-btn'
                    buttonText='Delete'
                    isFormValid={true}
                    isSendingReq={false}
                    onSubmit={handlePhotoDelete}

                />
                <CloseButton classname="close-btn popup__close-btn" onClick={onClose}/>
            </div>
        </div>
    );
}

export default DeletePhotoModal;