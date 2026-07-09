import { act, renderHook, waitFor } from "@testing-library/react";
import useAuth from "../hooks/useAuth";
import * as auth from "../../../shared/utils/auth";
import { createRouterWrapper } from "../../../test/mockRouter";
import { user } from "../../../test/fixtures/user";

jest.mock("../../../shared/utils/auth");

function renderUseAuth() {
  const openModal = jest.fn();
  const startLoading = jest.fn();
  const stopLoading = jest.fn();

  const view = renderHook(
    () =>
      useAuth({
        openModal,
        startLoading,
        stopLoading,
      }),
    { wrapper: createRouterWrapper() },
  );

  return {
    ...view,
    openModal,
    startLoading,
    stopLoading,
  };
}

describe("auth flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    auth.getContent.mockRejectedValue({ type: "AUTH_ERROR" });
  });

  test("restores session when profile request succeeds", async () => {
    auth.getContent.mockResolvedValue(user);

    const { result } = renderUseAuth();

    await waitFor(() => expect(result.current.isAuthInitialized).toBe(true));

    expect(result.current.loggedIn).toBe(true);
    expect(result.current.currentUser).toEqual(user);
  });

  test("signs in with valid credentials", async () => {
    auth.signin.mockResolvedValue({ user });

    const { result, startLoading, stopLoading } = renderUseAuth();

    await waitFor(() => expect(result.current.isAuthInitialized).toBe(true));

    await act(async () => {
      await result.current.handleSignin("admin@test.com", "12345678");
    });

    expect(auth.signin).toHaveBeenCalledWith("admin@test.com", "12345678");
    expect(result.current.loggedIn).toBe(true);
    expect(result.current.currentUser).toEqual(user);
    expect(startLoading).toHaveBeenCalled();
    expect(stopLoading).toHaveBeenCalled();
  });

  test("shows error modal for invalid login or password", async () => {
    auth.signin.mockRejectedValue(new Error("Wrong credentials"));

    const { result, openModal } = renderUseAuth();

    await waitFor(() => expect(result.current.isAuthInitialized).toBe(true));

    await act(async () => {
      await result.current.handleSignin("admin@test.com", "wrong");
    });

    expect(result.current.loggedIn).toBe(false);
    expect(openModal).toHaveBeenCalledWith(
      expect.objectContaining({ status: "error" }),
    );
  });

  test("logs out authenticated user", async () => {
    auth.getContent.mockResolvedValue(user);
    auth.signout.mockResolvedValue({});

    const { result } = renderUseAuth();

    await waitFor(() => expect(result.current.loggedIn).toBe(true));

    await act(async () => {
      await result.current.handleSignout();
    });

    expect(auth.signout).toHaveBeenCalled();
    expect(result.current.loggedIn).toBe(false);
    expect(result.current.currentUser).toEqual({});
  });
});
