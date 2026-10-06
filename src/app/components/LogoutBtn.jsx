function LogoutBtn({ className, onLogout, theme = "main" }) {
  return (
    <button
      className={`logout-btn logout-btn_theme_${theme} ${className}`}
      type="button"
      onClick={onLogout}
      aria-label="Log out"
    >
      <span className="logout-btn__icon" aria-hidden="true" />
    </button>
  );
}

export default LogoutBtn;
