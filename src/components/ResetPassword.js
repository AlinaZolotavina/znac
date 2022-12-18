import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Form from './Form';
import Input from './Input';
import newPasswordIcon from '../images/new-password-icon.svg';

function ResetPassword({ onResetPassword, isSendingReq }) {
    let { resetPasswordLink } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    function handlePasswordChange(e) {
        if (e.target.value.length < 8) {
            setNewPasswordError('Password must be at least 8 characters long');
        } else {
            setNewPasswordError('');
        }
        setNewPassword(e.target.value);
    }

    const [confirmPassword, setconfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    function handleConfirmPasswordChange(e) {
        if (e.target.value.length < 8) {
            setConfirmPasswordError('Password must be at least 8 characters long');
        } else {
            setConfirmPasswordError('');
        }
        setconfirmPassword(e.target.value);
    }

    const [isFormValid, setIsFormValid] = useState(false);
    useEffect(() => {
        if(newPassword && !newPasswordError && confirmPassword && !confirmPasswordError) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        };
    }, [newPassword, newPasswordError, confirmPassword, confirmPasswordError]);

    function handleReceiveEmail(e) {
        e.preventDefault();
        onResetPassword(newPassword, confirmPassword, resetPasswordLink);
    }

    return (
        <section className='forgot-password'>
            <div className='forgot-password__container'>
                <img
                    className='forgot-password__image'
                    src={`${newPasswordIcon}`}
                    alt='icon'
                />
                <Form
                    formName='forgot-password'
                    formClassname='form'
                    titleClassname='form__title forgot-password__title'
                    title='Create new password'
                    buttonClassname='form__submit-btn'
                    buttonText='Reset password'
                    isFormValid={isFormValid}
                    isSendingReq={isSendingReq}
                    onSubmit={handleReceiveEmail}
                >
                    <p className='form__subtitle'>New password must be different from previously used one</p>
                    <Input
                        inputLabel='New password'
                        placeholder='Enter new password'
                        classname='input__field'
                        inputType='password'
                        inputValue={newPassword}
                        onChange={handlePasswordChange}
                        isSendingReq={isSendingReq}
                        error={newPasswordError}
                    />
                    <Input
                        inputLabel='Confirm password'
                        placeholder='Enter new password again'
                        classname='input__field'
                        inputType='password'
                        inputValue={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        isSendingReq={isSendingReq}
                        error={confirmPasswordError}
                    />
                </Form>
            </div>
        </section>
    );
}

export default ResetPassword;

