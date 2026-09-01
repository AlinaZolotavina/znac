import { Link } from "react-router-dom";
import notFoundIcon from "../assets/not-found-icon.svg";

function NotFound() {
  return (
    <main className="not-found">
      <div className="not-found__container">
        <img
          className="not-found__image"
          src={notFoundIcon}
          alt="Not found icon"
        />
        <h1 className="not-found__text">Nothing was found!</h1>
        <p className="not-found__text">Сheck your request and try again.</p>
        <Link className="not-found__link" to="/">
          Back to Home
        </Link>
      </div>
    </main>
  );
}

export default NotFound;
