import victoryIcon from "../images/victory.svg";
import MenuOption from "./MenuOption";

function Popup({ isOpen, gameResult, onClose, onPlayAgain }) {
  return (
    <div className={`popup ${isOpen ? "popup_is-opened" : ""}`}>
      <div className="popup__container">
        <img className="popup__icon" src={victoryIcon} alt="Victory icon" />
        <h2 className="popup__title">You found all the pairs, congratz!</h2>
        <p className="popup__time">Your time is {gameResult}.</p>
        <div className="find-pair__menu">
          <button className="find-pair__menu-option" onClick={onPlayAgain}>
            Play again
          </button>
          <MenuOption
            buttonText="Leaderboard"
            page="/leaderboard"
            onClick={onClose}
          />
        </div>
        <button
          className="close-btn popup__close-btn"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
}

export default Popup;
