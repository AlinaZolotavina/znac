import { Link } from "react-router-dom";

function ProfileButton({ className = "", onClick, theme = "main" }) {
  return (
    <Link
      className={`profile-btn profile-btn_theme_${theme} ${className}`}
      to="/profile"
      onClick={onClick}
      aria-label="Open profile"
    />
  );
}

export default ProfileButton;
