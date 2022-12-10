import { useState } from 'react';
import { useEffect } from 'react';
import Form from './Form';
import Input from './Input';
import forgotPasswordIcon from '../images/forgot-password-icon.svg';


function ForgotPassword({ onReceiveEmail, isSendingReq }) {
    
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

    const [isFormValid, setIsFormValid] = useState(false);
    useEffect(() => {
        if(email && !emailError) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        };
    }, [email, emailError]);

    function handleReceiveEmail(e) {
        e.preventDefault();
        onReceiveEmail(email);
        setIsFormValid(false);
        setEmail('');
    }

    return (
        <section className='forgot-password'>
            <div className='forgot-password__container'>
                <img
                    className='forgot-password__image'
                    src={`${forgotPasswordIcon}`}
                    alt='icon'
                />
                <Form
                    formName='forgot-password'
                    formClassname='form'
                    titleClassname='form__title forgot-password__title'
                    title='Forgot password?'
                    buttonClassname='form__submit-btn'
                    buttonText='Receive e-mail'
                    isFormValid={isFormValid}
                    isSendingReq={isSendingReq}
                    onSubmit={handleReceiveEmail}
                >
                    <p className='form__subtitle'>Please enter your e-mail address to receive password change instructions</p>
                    <Input
                        inputLabel='E-mail'
                        placeholder='Enter your e-mail'
                        classname='input__field'
                        inputType='text'
                        inputValue={email}
                        onChange={handleEmailChange}
                        isSendingReq={isSendingReq}
                        error={emailError}
                    />
                </Form>
            </div>
        </section>
    );
}

export default ForgotPassword;

