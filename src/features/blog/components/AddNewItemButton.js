function AddNewItemButton({ buttonText, onAddNewItem }) {
  const isSmall = window.innerWidth < 768;

  return (
    <button className="add-new-item" onClick={onAddNewItem} type="button">
      <span className="add-new-item__button" />
      {!isSmall && <span className="add-button__text">{buttonText}</span>}
    </button>
  );
}

export default AddNewItemButton;
