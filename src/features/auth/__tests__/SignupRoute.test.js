import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import SignupRoute from "../components/SignupRoute";
import { mockApi } from "../../../test/mockApi";

jest.mock("../../../shared/utils/api", () => ({
  __esModule: true,
  default: jest.requireActual("../../../test/mockApi").mockApi,
}));

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

function renderSignupRoute() {
  return render(
    <QueryClientProvider client={createTestQueryClient()}>
      <MemoryRouter>
        <SignupRoute
          loggedIn={false}
          onLogout={jest.fn()}
          onMenuClick={jest.fn()}
          isMenuOpen={false}
          menuId="signup-menu"
          onSignup={jest.fn()}
          isSendingReq={false}
          onContactClick={jest.fn()}
        />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("SignupRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows 404 when signup is disabled", async () => {
    mockApi.getSiteSettings.mockResolvedValue({
      heroes: {
        main: null,
        gallery: null,
      },
      auth: {
        signupEnabled: false,
      },
    });

    renderSignupRoute();

    expect(await screen.findByText("Nothing was found!")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Create account" })).toBeNull();
  });

  test("shows signup page when signup is enabled", async () => {
    mockApi.getSiteSettings.mockResolvedValue({
      heroes: {
        main: null,
        gallery: null,
      },
      auth: {
        signupEnabled: true,
      },
    });

    renderSignupRoute();

    expect(
      await screen.findByRole("heading", { name: "Create account" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Nothing was found!")).toBeNull();
  });
});
