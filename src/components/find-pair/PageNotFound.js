import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div className="page-not-found">
      <div className="page-not-found__image" />
      <h1 className="page-not-found__title">404 - Page Not Found</h1>
      <p className="page-not-found__description">
        The page you are looking for doesn't exist.
      </p>
      <Link to="/" className="page-not-found__link">
        Back to Home
      </Link>
    </div>
  );
}

export default PageNotFound;
