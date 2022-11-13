import Form from "./Form";
import Input from "./Input";
import CloseButton from "./CloseButton";

function EditPasswordModal({ isOpen, onClose }) {
    return (
        <div className={`popup popup_type_photo ${isOpen && 'popup_is-opened'}`}>
            <div className="popup__container">
                <Form
                    formClassname='popup__form'
                    titleClassname='popup__title'
                    title='Edit password'
                    buttonClassname='popup__submit-btn'
                    buttonText='Save'
                >
                    <Input 
                        inputLabel=''
                        placeholder='Enter old password'
                        classname='popup__input-field'
                    />
                    <Input 
                        inputLabel=''
                        placeholder='Enter new password'
                        classname='popup__input-field'
                    />
                </Form>
                <CloseButton classname="close-btn popup__close-btn" onClick={onClose}/>
            </div>
        </div>
    );
}

export default EditPasswordModal;