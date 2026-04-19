function AddButton({ buttonClassname, buttonText, onClick }) {
  function handleClick(e) {
    onClick();
    e.target.blur();
  }
  return (
    <button className={buttonClassname} onClick={handleClick}>
      {buttonText}
    </button>
  );
}

export default AddButton;
