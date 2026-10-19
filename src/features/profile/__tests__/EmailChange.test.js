import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { CurrentUserContext } from "../../../contexts/CurrentUserContext";
import EditEmailModal from "../components/EditEmailModal";
import ConfirmEmailUpdate from "../components/ConfirmEmailUpdate";
import ProfileRoot from "../ProfileRoot";
import api from "../../../shared/utils/api";

jest.mock("../../../shared/utils/api", () => ({
  __esModule: true,
  default: {
    validateEmailChangeLink: jest.fn(),
    updateEmail: jest.fn(),
    requestEmailUpdate: jest.fn(),
  },
}));
jest.mock(
  "../components/Profile",
  () =>
    function Profile({ onEditEmailBtnClick }) {
      return <button onClick={onEditEmailBtnClick}>Edit email</button>;
    },
);

const navigation = {
  loggedIn: true,
  onLogout: jest.fn(),
  onMenuClick: jest.fn(),
  isMenuOpen: false,
  menuId: "profile-menu",
  onContactClick: jest.fn(),
};
const details = () => ({
  address: "new",
  pendingEmail: "new@test.com",
  expiresAt: new Date(Date.now() + 1200000).toISOString(),
});
const invalid = () =>
  Object.assign(new Error("Invalid link"), {
    code: "EMAIL_CHANGE_LINK_INVALID",
  });
function renderConfirmation(
  onUpdateEmail = jest.fn().mockResolvedValue({ completed: false }),
) {
  return render(
    <MemoryRouter initialEntries={["/profile/update-email/test-token"]}>
      <Routes>
        <Route
          path="/profile/update-email/:token"
          element={
            <ConfirmEmailUpdate {...navigation} onUpdateEmail={onUpdateEmail} />
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  api.validateEmailChangeLink.mockResolvedValue(details());
});

test("email edit requires the current password and sends a normalized address", () => {
  const submit = jest.fn();
  render(
    <CurrentUserContext.Provider value={{ email: "old@test.com" }}>
      <EditEmailModal
        isOpen
        onClose={jest.fn()}
        isSendingReq={false}
        onRequestEmailChange={submit}
      />
    </CurrentUserContext.Provider>,
  );
  const button = screen.getByRole("button", {
    name: "Request an email change",
  });
  fireEvent.change(screen.getByLabelText("New e-mail"), {
    target: { value: "NEW@TEST.COM" },
  });
  expect(button).toBeDisabled();
  const password = screen.getByLabelText("Current password");
  expect(password).toHaveAttribute("type", "password");
  expect(password).toHaveAttribute("autocomplete", "current-password");
  fireEvent.change(password, { target: { value: "12345678" } });
  fireEvent.click(button);
  expect(submit).toHaveBeenCalledWith({
    email: "new@test.com",
    currentPassword: "12345678",
  });
});

test("a fresh browser checks the link without local storage or automatic confirmation", async () => {
  const submit = jest.fn().mockResolvedValue({ completed: false });
  renderConfirmation(submit);
  expect(
    await screen.findByRole("heading", { name: "Confirm your email change" }),
  ).toBeInTheDocument();
  expect(screen.getByText(/new@test.com/)).toBeInTheDocument();
  expect(submit).not.toHaveBeenCalled();
  expect(api.validateEmailChangeLink).toHaveBeenCalledWith(
    "test-token",
    expect.any(AbortSignal),
  );
  fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
  expect(
    await screen.findByRole("heading", { name: "Email address confirmed" }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Open the other confirmation email/),
  ).toBeInTheDocument();
  expect(submit).toHaveBeenCalledWith("test-token");
  expect(localStorage.getItem("email")).toBeNull();
});

test("invalid and already used links cannot be submitted", async () => {
  api.validateEmailChangeLink.mockRejectedValue(invalid());
  const submit = jest.fn();
  renderConfirmation(submit);
  expect(
    await screen.findByRole("heading", {
      name: "Link expired or already used",
    }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Confirm" }),
  ).not.toBeInTheDocument();
  expect(submit).not.toHaveBeenCalled();
});

test("network errors can be retried without calling the link invalid", async () => {
  api.validateEmailChangeLink.mockRejectedValueOnce(
    new Error("Network unavailable"),
  );
  renderConfirmation();
  fireEvent.click(await screen.findByRole("button", { name: "Try again" }));
  expect(
    await screen.findByRole("button", { name: "Confirm" }),
  ).toBeInTheDocument();
  expect(api.validateEmailChangeLink).toHaveBeenCalledTimes(2);
});

test("a link consumed elsewhere switches to the invalid state on confirmation", async () => {
  renderConfirmation(jest.fn().mockRejectedValue(invalid()));
  fireEvent.click(await screen.findByRole("button", { name: "Confirm" }));
  expect(
    await screen.findByRole("heading", {
      name: "Link expired or already used",
    }),
  ).toBeInTheDocument();
});

test("a duplicate email conflict is shown and does not sign the user out", async () => {
  renderConfirmation(
    jest
      .fn()
      .mockRejectedValue(new Error("User with this email already exists")),
  );
  fireEvent.click(await screen.findByRole("button", { name: "Confirm" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "User with this email already exists",
  );
  expect(screen.getByRole("button", { name: "Confirm" })).toBeEnabled();
});

function renderProfileRoute(pathname, clearSession) {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <CurrentUserContext.Provider value={{ email: "old@test.com" }}>
        <Routes>
          <Route
            path="/profile/*"
            element={
              <ProfileRoot
                loggedIn
                isAuthInitialized
                clearSession={clearSession}
                isLoading={false}
                startLoading={jest.fn()}
                stopLoading={jest.fn()}
                openModal={jest.fn()}
                onMenuClick={jest.fn()}
                handleSignout={jest.fn()}
                isMenuOpen={false}
                onContactClick={jest.fn()}
              />
            }
          />
          <Route path="/signin" element={<h1>Sign in again</h1>} />
        </Routes>
      </CurrentUserContext.Provider>
    </MemoryRouter>,
  );
}

test("the final confirmation clears the session and navigates to signin", async () => {
  const clearSession = jest.fn();
  api.updateEmail.mockResolvedValue({ completed: true });
  renderProfileRoute("/profile/update-email/test-token", clearSession);
  fireEvent.click(await screen.findByRole("button", { name: "Confirm" }));
  expect(
    await screen.findByRole("heading", { name: "Sign in again" }),
  ).toBeInTheDocument();
  expect(clearSession).toHaveBeenCalledTimes(1);
  expect(api.updateEmail).toHaveBeenCalledWith("test-token");
});

test("requesting an email change sends the password without persisting it", async () => {
  api.requestEmailUpdate.mockResolvedValue({});
  renderProfileRoute("/profile", jest.fn());
  fireEvent.click(screen.getByRole("button", { name: "Edit email" }));
  fireEvent.change(screen.getByLabelText("New e-mail"), {
    target: { value: "NEW@TEST.COM" },
  });
  fireEvent.change(screen.getByLabelText("Current password"), {
    target: { value: "12345678" },
  });
  fireEvent.click(
    screen.getByRole("button", { name: "Request an email change" }),
  );
  await waitFor(() =>
    expect(api.requestEmailUpdate).toHaveBeenCalledWith(
      "new@test.com",
      "12345678",
    ),
  );
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  );
  expect(localStorage.length).toBe(0);
});
