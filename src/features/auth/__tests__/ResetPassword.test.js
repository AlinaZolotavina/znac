import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ResetPassword from "../components/ResetPassword";
import { validateResetPasswordLink } from "../../../shared/utils/auth";

jest.mock("../../../shared/utils/auth", () => ({
  validateResetPasswordLink: jest.fn(),
}));

const invalidLink = () =>
  Object.assign(new Error("Invalid link"), { code: "RESET_LINK_INVALID" });

function renderReset(onResetPassword = jest.fn()) {
  return render(
    <MemoryRouter initialEntries={["/reset-password/test-token"]}>
      <Routes>
        <Route
          path="/reset-password/:resetPasswordLink"
          element={
            <ResetPassword
              loggedIn={false}
              onLogout={jest.fn()}
              onMenuClick={jest.fn()}
              isMenuOpen={false}
              menuId="reset-menu"
              onResetPassword={onResetPassword}
              isSendingReq={false}
              onContactClick={jest.fn()}
            />
          }
        />
        <Route path="/signin/recovery" element={<h1>Request reset email</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  validateResetPasswordLink.mockResolvedValue({
    expiresAt: new Date(Date.now() + 1200000).toISOString(),
  });
});
afterEach(() => jest.useRealTimers());

test("checks the link before showing the form without submitting a reset", async () => {
  const onReset = jest.fn();
  renderReset(onReset);
  expect(
    screen.getByRole("heading", { name: "Checking reset link…" }),
  ).toBeInTheDocument();
  expect(
    await screen.findByRole("heading", { name: "Create new password" }),
  ).toBeInTheDocument();
  expect(validateResetPasswordLink).toHaveBeenCalledWith(
    "test-token",
    expect.any(AbortSignal),
  );
  expect(onReset).not.toHaveBeenCalled();
});

test("expired and used links offer a new reset email", async () => {
  validateResetPasswordLink.mockRejectedValue(invalidLink());
  renderReset();
  expect(
    await screen.findByRole("heading", {
      name: "Link expired or already used",
    }),
  ).toBeInTheDocument();
  expect(screen.queryByLabelText("New password")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("link", { name: "Request a new link" }));
  expect(
    screen.getByRole("heading", { name: "Request reset email" }),
  ).toBeInTheDocument();
});

test("network errors can be retried without calling the link expired", async () => {
  validateResetPasswordLink.mockRejectedValueOnce(
    new Error("Network unavailable"),
  );
  renderReset();
  fireEvent.click(await screen.findByRole("button", { name: "Try again" }));
  expect(
    await screen.findByRole("heading", { name: "Create new password" }),
  ).toBeInTheDocument();
  expect(validateResetPasswordLink).toHaveBeenCalledTimes(2);
});

test("a link consumed in another tab switches the submitted form to the invalid state", async () => {
  const onReset = jest.fn().mockRejectedValue(invalidLink());
  renderReset(onReset);
  await screen.findByRole("heading", { name: "Create new password" });
  fireEvent.change(screen.getByLabelText("New password"), {
    target: { value: "new-password-123" },
  });
  fireEvent.change(screen.getByLabelText("Confirm password"), {
    target: { value: "new-password-123" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Reset password" }));
  expect(
    await screen.findByRole("heading", {
      name: "Link expired or already used",
    }),
  ).toBeInTheDocument();
  expect(onReset).toHaveBeenCalledWith(
    "new-password-123",
    "new-password-123",
    "test-token",
  );
});

test("the form expires while the page remains open", async () => {
  jest.useFakeTimers();
  validateResetPasswordLink.mockResolvedValue({
    expiresAt: new Date(Date.now() + 1000).toISOString(),
  });
  renderReset();
  await act(async () => {});
  expect(
    screen.getByRole("heading", { name: "Create new password" }),
  ).toBeInTheDocument();
  act(() => jest.advanceTimersByTime(1000));
  expect(
    screen.getByRole("heading", { name: "Link expired or already used" }),
  ).toBeInTheDocument();
});

test("unmounting cancels an unfinished validity check", async () => {
  validateResetPasswordLink.mockImplementation(() => new Promise(() => {}));
  const view = renderReset();
  await waitFor(() => expect(validateResetPasswordLink).toHaveBeenCalled());
  const signal = validateResetPasswordLink.mock.calls[0][1];
  view.unmount();
  expect(signal.aborted).toBe(true);
});
