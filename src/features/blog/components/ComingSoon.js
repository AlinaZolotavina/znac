import logo from "../assets/tic-tac-toe-coming-soon.png";
import "../styles/coming-soon.css";
import { Link } from "react-router-dom";

export default function ComingSoon() {
  return (
    <div className="coming-soon">
      <div className="coming-soon__content">
        <div className="coming-soon__logo-wrapper">
          <img className="coming-soon__logo" src={logo} alt="Tic Tac Toe" />
        </div>

        <h1 className="coming-soon__title">
          Oops... You got here a little early.
        </h1>

        <p className="coming-soon__subtitle">
          The game isn't online just yet, but it is on its way, and as soon as
          it's published, this link will magically open it instead of this page.
        </p>

        <p className="coming-soon__footer">See you soon.</p>

        <Link className="coming-soon__link" to="/alina/games">
          Back to Games
        </Link>
      </div>
    </div>
  );
}
