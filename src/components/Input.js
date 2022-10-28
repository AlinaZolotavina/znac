function Input({ inputLabel, placeholder, classname }) {
    return (
        <label className='input'>
            {inputLabel}
            <input
                className={classname}
                placeholder={placeholder}
            />
            <span className='input__error'>error</span>
        </label>
    );
}

export default Input;