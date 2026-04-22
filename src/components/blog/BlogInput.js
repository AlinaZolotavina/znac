function BlogInput({
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
    <label className="blog-input">
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
      <span className="blog-input__error">{error}</span>
    </label>
  );
}

export default BlogInput;
