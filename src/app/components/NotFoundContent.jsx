import notFoundIcon from "../assets/not-found-icon.svg";

function NotFoundContent() {
  return (
    <div className="not-found-content">
      <img className="not-found-content__icon" src={notFoundIcon} alt="" />
      <p className="not-found-content__text">No content to show</p>
    </div>
  );
}

export default NotFoundContent;
