import { Link } from "react-router-dom";

function MenuOption({ buttonText, page, onClick }) {
  return (
    <Link className="find-pair__menu-option" to={page} onClick={onClick}>
      {buttonText}
    </Link>
  );
}

export default MenuOption;
