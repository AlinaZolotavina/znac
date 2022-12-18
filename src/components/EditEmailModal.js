import { useEffect, useState } from 'react';
import Form from "./Form";
import Input from "./Input";
import CloseButton from "./CloseButton";

function EditEmailModal({ isOpen, onClose, isSendingReq, onRequestEmailChange }) {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    function handleEmailChange(e) {
        const emailRegex = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/i;
        const isEmailValid = emailRegex.test(e.target.value);
        if (!isEmailValid) {
            setEmailError('Please enter a valid e-mail');
        } else {
            setEmailError('');
        }
        setEmail(e.target.value);
    }
    function handleSubmit(e) {
        e.preventDefault();
        onRequestEmailChange({ email: email });
    }

    const [isFormValid, setIsFormValid] = useState(false);
    useEffect(() => {
        if(email && !emailError) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [email, emailError]);

    return (
        <div className={`popup popup_type_photo ${isOpen && 'popup_is-opened'}`}>
            <div className="popup__container">
                <Form
                    formName='request-email-change'
                    formClassname='popup__form'
                    titleClassname='popup__title'
                    title='Edit e-mail'
                    buttonClassname='popup__submit-btn'
                    buttonText='Request an email change'
                    isFormValid={isFormValid}
                    isSendingReq={isSendingReq}
                    onSubmit={handleSubmit}
                >
                    <Input 
                        inputLabel=''
                        placeholder='Enter new e-mail'
                        classname='popup__input-field'
                        inputType='text'
                        inputValue={email}
                        onChange={handleEmailChange}
                        isSendingReq={isSendingReq}
                        error={emailError}
                    />
                </Form>
                <CloseButton classname="close-btn popup__close-btn" onClick={onClose}/>
            </div>
        </div>
    );
}

export default EditEmailModal;