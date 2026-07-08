function NewPostRadioButton({
  classname,
  radioBtnValue,
  radioBtnName,
  checkValue,
  onClick,
  labelText,
}) {
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
        name={radioBtnName}
        id={radioBtnValue}
        onChange={() => onClick(radioBtnValue)}
      />
      <label htmlFor={radioBtnValue}>{labelText}</label>
    </div>
  );
}

export default NewPostRadioButton;
