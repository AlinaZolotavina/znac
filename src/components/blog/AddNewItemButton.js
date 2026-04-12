import AddButton from "./AddButton";

function AddNewItemButton({ buttonText, onAddNewItem }) {
  const isSmall = window.innerWidth < 768;
  function handleClick(e) {
    onAddNewItem();
    e.target.blur();
  }
  return (
    <div className="add-new-item" onClick={handleClick}>
      <AddButton buttonText="" buttonClassname="add-new-item__button" />
      {!isSmall && <p className="add-button__text">{buttonText}</p>}
    </div>
  );
}

export default AddNewItemButton;
