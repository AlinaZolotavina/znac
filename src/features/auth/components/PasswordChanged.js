import { Link } from "react-router-dom";
import AuthNavigation from "../../../app/components/AuthNavigation";
import passwordChangedIcon from "../assets/password-changed-icon.svg";

function PasswordChanged({
  loggedIn,
  onLogout,
  onMenuClick,
  isMenuOpen,
  menuId,
  onContactClick,
}) {
  return (
    <main className="password-changed">
      <AuthNavigation
        loggedIn={loggedIn}
        onLogout={onLogout}
        onMenuClick={onMenuClick}
        isMenuOpen={isMenuOpen}
        menuId={menuId}
        onContactClick={onContactClick}
      />
      <div className="password-changed__container">
        <img
          className="password-changed__image"
          src={passwordChangedIcon}
          alt="Icon"
        />
        <h1 className="password-changed__text">
          Password was successfully changed!
        </h1>
        <Link className="password-changed__link" to="/">
          Back to Home
        </Link>
      </div>
    </main>
  );
}

export default PasswordChanged;
