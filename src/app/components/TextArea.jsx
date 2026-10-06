function normalizeId(value) {
  return value
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function TextArea({
  labelClassname,
  inputId,
  placeholder,
  classname,
  value,
  onChange,
  isSendingReq,
  error,
  inputName,
  maxLength,
}) {
  const fieldId = inputId || normalizeId(inputName) || normalizeId(placeholder);
  const errorId = fieldId ? `${fieldId}-error` : undefined;
  const hasError = Boolean(error);

  return (
    <label className={labelClassname || ""}>
      <textarea
        id={fieldId}
        className={classname}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        disabled={isSendingReq}
        name={inputName}
        maxLength={maxLength}
        aria-invalid={hasError ? "true" : undefined}
        aria-describedby={hasError ? errorId : undefined}
      />
      <span className="input__error" id={errorId}>
        {error}
      </span>
    </label>
  );
}

export default TextArea;
