function AddButton({ buttonClassname, buttonText, onClick, ariaLabel }) {
  return (
    <button className={buttonClassname} onClick={onClick} aria-label={ariaLabel}>
      {buttonText}
    </button>
  );
}

export default AddButton;
