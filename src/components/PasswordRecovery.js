import Form from './Form';
import Input from './Input';

import { useState } from 'react';

import forgotPasswordIcon from '../images/forgot-password-icon.svg';

function PasswordRecovery() {
    const [title, setTitle] = useState('Forgot password?');
    const [subtitle, setSubtitle] = useState('Please enter your e-mail address to receive a verification code');
    const [buttonText, setButtonText] = useState('Get code');
    const [inputLabel, setInputLabel] = useState('E-mail');
    const [placeholder, setPlaceholder] = useState('Enter your e-mail');

    return (
        <section className='reset-password'>
            <div className='reset-password__container'>
                <img
                    className='reset-password__image'
                    src={`${forgotPasswordIcon}`}
                    alt='icon'
                />
                <Form
                    formClassname='form'
                    titleClassname='form__title reset-password__title'
                    title={title}
                    buttonClassname='form__submit-btn'
                    buttonText={buttonText}
                >
                    <p className='form__subtitle'>{subtitle}</p>
                    <Input
                        inputLabel={inputLabel}
                        placeholder={placeholder}
                        classname='input__field'
                    />
                </Form>
            </div>
        </section>
    );
}

export default PasswordRecovery;

