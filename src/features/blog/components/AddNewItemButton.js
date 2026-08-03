function AddNewItemButton({
  buttonText,
  onAddNewItem,
  className = "",
  alwaysShowText = false,
}) {
  const isSmall = window.innerWidth < 768;

  return (
    <button
      className={`add-new-item ${className}`.trim()}
      onClick={onAddNewItem}
      type="button"
    >
      <span className="add-new-item__button" aria-hidden="true" />
      {(alwaysShowText || !isSmall) && (
        <span className="add-button__text">{buttonText}</span>
      )}
    </button>
  );
}

export default AddNewItemButton;
