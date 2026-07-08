import { Navigate } from "react-router-dom";

function ProtectedRoute({ loggedIn, isAuthInitialized, children }) {
  console.log("ProtectedRoute", {
    loggedIn,
    isAuthInitialized,
  });

  if (!isAuthInitialized) {
    return null;
  }

  if (!loggedIn) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}

export default ProtectedRoute;
