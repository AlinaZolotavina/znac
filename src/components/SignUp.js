import Form from './Form';
import Input from './Input';

import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';

function SignUp({ onSignup, isSendingReq }) {
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

    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    function handlePasswordChange(e) {
        if (e.target.value.length < 8) {
            setPasswordError('Password must be at least 8 characters long');
        } else {
            setPasswordError('');
        }
        setPassword(e.target.value);
    }

    const [isFormValid, setIsFormValid] = useState(false);
    useEffect(() => {
        if(email && password && !emailError && !passwordError) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        };
    }, [email, password, emailError, passwordError]);

    function handleSignup(e) {
        e.preventDefault();
        onSignup(email, password);
    };

    return (
        <section className='sign-up'>
            <div className='sign-up__container'>
                <Form
                    formName='signup'
                    formClassname='form'
                    titleClassname='form__title'
                    title='Create account'
                    buttonClassname='form__submit-btn'
                    buttonText='Sign up'
                    isFormValid={isFormValid}
                    isSendingReq={isSendingReq}
                    onSubmit={handleSignup}
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
                    <Input 
                        inputLabel='Password'
                        placeholder='Enter password'
                        classname='input__field'
                        inputType='password'
                        inputValue={password}
                        onChange={handlePasswordChange}
                        isSendingReq={isSendingReq}
                        error={passwordError}
                    />
                </Form>
                <div className='form__additional-info'>
                    <p className='form__link-note'>Already registered?</p>
                    <Link className='form__link' to='/'>Sign in</Link>
                </div> 
            </div>
            
        </section>
    );
}

export default SignUp;