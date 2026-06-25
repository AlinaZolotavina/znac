import notFound from "../../images/blog-not-found-icon.svg";
import AddButton from "./AddButton";

function ContentNotFound({ loggedIn, altText, text, buttonText, onClick }) {
  return (
    <div className="content-not-found">
      <img className="content-not-found__icon" src={notFound} alt={altText} />
      <p className="content-not-found__text">{text}</p>
      {loggedIn && (
        <AddButton
          buttonClassname="content-not-found__add-btn"
          buttonText={buttonText}
          onClick={onClick}
        />
      )}
    </div>
  );
}

export default ContentNotFound;
