import Form from "./Form";
import Input from "./Input";
import CloseButton from "./CloseButton";

function EditEmailModal({ isOpen, onClose }) {
    return (
        <div className={`popup popup_type_photo ${isOpen && 'popup_is-opened'}`}>
            <div className="popup__container">
                <Form
                    formClassname='popup__form'
                    titleClassname='popup__title'
                    title='Edit e-mail'
                    buttonClassname='popup__submit-btn'
                    buttonText='Save'
                >
                    <Input 
                        inputLabel=''
                        placeholder='Enter new e-mail'
                        classname='popup__input-field'
                    />
                </Form>
                <CloseButton classname="close-btn popup__close-btn" onClick={onClose}/>
            </div>
        </div>
    );
}

export default EditEmailModal;