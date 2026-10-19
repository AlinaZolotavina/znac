function normalizeId(value) {
  return value
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function BlogInput({
  inputId,
  placeholder,
  classname,
  inputType,
  inputValue,
  onChange,
  isSendingReq,
  error,
  inputName,
  maxLength,
  required = true,
  label,
}) {
  const fieldId = inputId || normalizeId(inputName) || normalizeId(placeholder);
  const errorId = fieldId ? `${fieldId}-error` : undefined;
  const hasError = Boolean(error);

  return (
    <label className="blog-input">
      {label && <span className="blog-input__label">{label}</span>}
      <input
        id={fieldId}
        className={classname}
        placeholder={placeholder}
        aria-label={label || placeholder}
        type={inputType}
        value={inputValue}
        onChange={onChange}
        required={required}
        disabled={isSendingReq}
        name={inputName}
        maxLength={maxLength}
        aria-invalid={hasError ? "true" : undefined}
        aria-describedby={hasError ? errorId : undefined}
      />
      <span className="blog-input__error" id={errorId}>
        {error}
      </span>
    </label>
  );
}

export default BlogInput;
