function BurgerMenu({ onMenuClick }) {
  return (
    <button
      className="burger-menu"
      onClick={onMenuClick}
      aria-label="Open menu"
    />
  );
}

export default BurgerMenu;
