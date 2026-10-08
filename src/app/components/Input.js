function normalizeId(value) {
  return value
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function Input({
  labelClassname,
  inputLabel,
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
  hideError = false,
}) {
  const fieldId =
    inputId ||
    normalizeId(inputName) ||
    normalizeId(inputLabel) ||
    normalizeId(placeholder);
  const errorId = fieldId ? `${fieldId}-error` : undefined;
  const hasError = Boolean(error);

  return (
    <label className={`${labelClassname || ""} input`}>
      {inputLabel}
      <input
        id={fieldId}
        className={classname}
        placeholder={placeholder}
        type={inputType}
        value={inputValue}
        onChange={onChange}
        required
        disabled={isSendingReq}
        name={inputName}
        maxLength={maxLength}
        aria-invalid={hasError ? "true" : undefined}
        aria-describedby={hasError ? errorId : undefined}
      />
      {!hideError && (
        <span className="input__error" id={errorId}>
          {error}
        </span>
      )}
    </label>
  );
}

export default Input;
