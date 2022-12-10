import React from "react";

import successIcon from '../images/success-icon.svg';
import failureIcon from '../images/failure-icon.svg';

function Modal({ isOpen, isSuccess, onClose, message }) {
    return (
        <div className={`popup ${isOpen && 'popup_is-opened'}`}>
            <div className="modal">
                <img className="modal__icon" src={isSuccess ? successIcon : failureIcon} alt='Icon' />
                <h2 className="modal__message">
                    {message}
                </h2>
                <button className="close-btn popup__close-btn" onClick={onClose}></button>
            </div>
        </div>
        )
}

export default Modal;