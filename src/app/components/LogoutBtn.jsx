function LogoutBtn({ className, onLogout, theme = "main" }) {
  return (
    <button
      className={`logout-btn logout-btn_theme_${theme} ${className}`}
      type="button"
      onClick={onLogout}
    >
      Log out
    </button>
  );
}

export default LogoutBtn;
