import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ loggedIn, isAuthInitialized, children }) {
  const location = useLocation();
  if (!isAuthInitialized) {
    return null;
  }

  if (!loggedIn) {
    return (
      <Navigate to="/signin" replace state={{ from: location.pathname }} />
    );
  }

  return children;
}

export default ProtectedRoute;
