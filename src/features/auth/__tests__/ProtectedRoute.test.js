import { Route, Routes } from "react-router-dom";
import { screen } from "@testing-library/react";
import ProtectedRoute from "../../../app/components/ProtectedRoute";
import { renderWithProviders } from "../../../test/renderWithProviders";

function renderRoute({ loggedIn, isAuthInitialized }) {
  return renderWithProviders(
    <Routes>
      <Route
        path="/private"
        element={
          <ProtectedRoute
            loggedIn={loggedIn}
            isAuthInitialized={isAuthInitialized}
          >
            <div>Private page</div>
          </ProtectedRoute>
        }
      />
      <Route path="/signin" element={<div>Sign in page</div>} />
    </Routes>,
    { route: "/private" },
  );
}

describe("ProtectedRoute", () => {
  test("renders nothing while auth is initializing", () => {
    const { container } = renderRoute({
      loggedIn: false,
      isAuthInitialized: false,
    });

    expect(container).toBeEmptyDOMElement();
  });

  test("redirects guest to signin", () => {
    renderRoute({
      loggedIn: false,
      isAuthInitialized: true,
    });

    expect(screen.getByText("Sign in page")).toBeInTheDocument();
  });

  test("renders protected content for authenticated user", () => {
    renderRoute({
      loggedIn: true,
      isAuthInitialized: true,
    });

    expect(screen.getByText("Private page")).toBeInTheDocument();
  });
});
