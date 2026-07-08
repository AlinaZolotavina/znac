function Input({
  labelClassname,
  inputLabel,
  placeholder,
  classname,
  inputType,
  inputValue,
  onChange,
  isSendingReq,
  error,
  inputName,
}) {
  return (
    <label className={`${labelClassname} input`}>
      {inputLabel}
      <input
        className={classname}
        placeholder={placeholder}
        type={inputType}
        value={inputValue}
        onChange={onChange}
        required
        disabled={isSendingReq}
        name={inputName}
      />
      <span className="input__error">{error}</span>
    </label>
  );
}

export default Input;
