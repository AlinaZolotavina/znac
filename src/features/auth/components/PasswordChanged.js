import { Link } from "react-router-dom";
import AuthHeader from "../../../app/components/AuthHeader";
import passwordChangedIcon from "../assets/password-changed-icon.svg";

function PasswordChanged({ onContactClick }) {
  return (
    <main className="password-changed">
      <AuthHeader onContactClick={onContactClick} />
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
