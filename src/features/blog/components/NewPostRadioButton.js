function NewPostRadioButton({
  classname,
  radioBtnValue,
  radioBtnName,
  idPrefix = "new-post",
  checkValue,
  onClick,
  onArrowNavigate,
  labelText,
}) {
  const inputId = `${idPrefix}-${radioBtnName}-${String(radioBtnValue)
    .toLowerCase()
    .replace(/\s+/g, "-")}`;
  const inputName = `${idPrefix}-${radioBtnName}`;
  const arrowKeys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"];

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      onClick(radioBtnValue);
    }

    if (e.key === "ArrowLeft" && onArrowNavigate) {
      onArrowNavigate(e, radioBtnValue, "left");
      return;
    }

    if (e.key === "ArrowRight" && onArrowNavigate) {
      onArrowNavigate(e, radioBtnValue, "right");
      return;
    }

    if (arrowKeys.includes(e.key)) {
      e.preventDefault();

      const radioButtons = Array.from(document.getElementsByName(inputName));
      const currentIndex = radioButtons.indexOf(e.currentTarget);

      if (radioButtons.length === 0 || currentIndex === -1) {
        return;
      }

      const direction =
        e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
      const nextIndex =
        (currentIndex + direction + radioButtons.length) % radioButtons.length;

      radioButtons[nextIndex].focus();
    }
  }

  return (
    <div
      className={`new-post__radio-btn ${classname} ${
        radioBtnValue === checkValue
          ? "new-post__radio-btn_state_active"
          : "new-post__radio-btn_state_inactive"
      }`}
      onClick={() => onClick(radioBtnValue)}
    >
      <input
        type="radio"
        className="radio-btn__input"
        checked={radioBtnValue === checkValue}
        value={radioBtnValue}
        name={inputName}
        id={inputId}
        onChange={() => onClick(radioBtnValue)}
        onKeyDown={handleKeyDown}
        aria-label={!labelText ? `${radioBtnValue} icon` : undefined}
      />
      <label htmlFor={inputId}>{labelText}</label>
    </div>
  );
}

export default NewPostRadioButton;
