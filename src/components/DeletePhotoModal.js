import Form from "./Form";
import CloseButton from "./CloseButton";

function DeletePhotoModal({ isOpen, onClose }) {
    return (
        <div className={`popup popup_type_delete-photo ${isOpen && 'popup_is-opened'}`}>
            <div className="popup__container">
                <Form
                    formClassname='popup__form'
                    titleClassname='popup__title'
                    title='Are you sure you want to delete the photo?'
                    buttonClassname='popup__submit-btn'
                    buttonText='Delete'
                />
                <CloseButton classname="close-btn popup__close-btn" onClick={onClose}/>
            </div>
        </div>
    );
}

export default DeletePhotoModal;