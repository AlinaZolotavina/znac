function Input({ inputLabel, placeholder, classname, inputType, inputValue, onChange, isSendingReq, error }) {
    return (
        <label className='input'>
            {inputLabel}
            <input
                className={classname}
                placeholder={placeholder}
                type={inputType}
                value={inputValue}
                onChange={onChange}
                required
                disabled={isSendingReq}
            />
            <span className='input__error'>{error}</span>
        </label>
    );
}

export default Input;