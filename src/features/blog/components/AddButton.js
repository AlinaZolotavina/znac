function AddButton({ buttonClassname, buttonText, onClick }) {
  return (
    <button className={buttonClassname} onClick={onClick}>
      {buttonText}
    </button>
  );
}

export default AddButton;
