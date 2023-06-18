import Form from './Form';
import Input from './Input';
import ToggleVisibilityBtn from './ToggleVisibilityBtn';

import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';

function SignIn({ onSignin, isSendingReq }) {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    function handleEmailChange(e) {
        const emailRegex = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/i;
        const isEmailValid = emailRegex.test(e.target.value);
        if (!isEmailValid) {
            setEmailError('Please enter a valid e-mail');
        } else {
            setEmailError('');
        }
        setEmail(e.target.value);
    };

    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    function handlePasswordChange(e) {
        if (e.target.value.length < 8) {
            setPasswordError('Password must be at least 8 characters long')
        } else {
            setPasswordError('');
        }
        setPassword(e.target.value);
    };

    const [isFormValid, setIsFormValid] = useState(false);
    useEffect(() => {
        if (email && password && !emailError && !passwordError) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        };
    }, [email, password, emailError, passwordError]);

    function handleSignin(e) {
        e.preventDefault();
        onSignin(email, password);
    }

    function handleVisibilityBtnClick() {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <section className='sign-in'>
            <div className='sign-in__container'>
                <Form
                    formName='signin'
                    formClassname='form'
                    titleClassname='form__title'
                    title='Glad to see you again!'
                    buttonClassname='form__submit-btn'
                    buttonText='Sign in'
                    isFormValid={isFormValid}
                    isSendingReq={isSendingReq}
                    onSubmit={handleSignin}
                >
                    <Input 
                        inputLabel='E-mail'
                        placeholder='Enter e-mail'
                        classname='input__field'
                        inputType='text'
                        inputValue={email}
                        onChange={handleEmailChange}
                        isSendingReq={isSendingReq}
                        error={emailError}
                    />
                    <div className='password-field'>
                        <Input 
                            inputLabel='Password'
                            placeholder='Enter password'
                            classname='input__field input__field_type_password'
                            inputType={isPasswordVisible ? 'text' : 'password'}
                            inputValue={password}
                            onChange={handlePasswordChange}
                            isSendingReq={isSendingReq}
                            error={passwordError}
                        />
                        <ToggleVisibilityBtn 
                            isPasswordVisible={isPasswordVisible}
                            onVisibilityBtnClick={handleVisibilityBtnClick}
                        />
                    </div>
                    
                </Form>
                <div className='form__additional-info'>
                    <p className='form__link-note'>Forgot your password?</p>
                    <Link className='form__link' to='/signin/recovery'>Reset</Link>
                </div>
                
            </div>
            
        </section>
    );
}

export default SignIn;