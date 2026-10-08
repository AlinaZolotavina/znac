import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { CurrentUserContext } from "../../../contexts/CurrentUserContext";
import Profile from "../components/Profile";
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
      mutations: {
        retry: false,
      },
    },
  });
}

function renderProfile(user) {
  return render(
    <QueryClientProvider client={createTestQueryClient()}>
      <MemoryRouter>
        <CurrentUserContext.Provider value={user}>
          <Profile
            loggedIn
            onEditEmailBtnClick={jest.fn()}
            onEditPasswordBtnClick={jest.fn()}
            onMenuClick={jest.fn()}
            onLogout={jest.fn()}
            isMenuOpen={false}
            menuId="profile-menu"
            onContactClick={jest.fn()}
          />
        </CurrentUserContext.Provider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

function createDeferred() {
  let resolve;
  let reject;
  const promise = new Promise((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  return {
    promise,
    resolve,
    reject,
  };
}

describe("Profile settings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    URL.createObjectURL = jest.fn(() => "blob:hero-preview");
    URL.revokeObjectURL = jest.fn();
    mockApi.getSiteSettings.mockResolvedValue({
      heroes: {
        main: {
          url: "https://api.test/uploads/heroes/main.jpg",
          filename: "main.jpg",
          updatedAt: "2026-10-07T00:00:00.000Z",
        },
        gallery: null,
      },
      auth: {
        signupEnabled: false,
      },
      colors: {
        accent: {
          value: "#c5e7bc",
        },
      },
    });
  });

  test("shows regular profile title and hides admin sections for non-admin users", () => {
    renderProfile({
      email: "user@test.com",
      role: "user",
    });

    expect(
      screen.getByRole("heading", {
        name: "Profile",
        level: 1,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Hero Images" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Site Settings" }),
    ).not.toBeInTheDocument();
  });

  test("shows admin settings sections", async () => {
    const { container } = renderProfile({
      email: "admin@test.com",
      role: "admin",
    });

    expect(
      screen.getByRole("heading", {
        name: "Profile & Settings",
        level: 1,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Hero Images" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Colors" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Site Settings" }),
    ).toBeInTheDocument();

    await waitFor(() =>
      expect(container.querySelector(".profile__hero-image")).toHaveAttribute(
        "src",
        "https://api.test/uploads/heroes/main.jpg",
      ),
    );
  });

  test("replaces main hero image", async () => {
    mockApi.updateHeroImage.mockResolvedValue({
      filename: "new-main.jpg",
      url: "https://api.test/uploads/heroes/new-main.jpg",
    });
    renderProfile({
      email: "admin@test.com",
      role: "admin",
    });

    const fileInput = await screen.findByLabelText("Replace Main page hero");

    fireEvent.change(fileInput, {
      target: {
        files: [new File(["image"], "new-main.jpg", { type: "image/jpeg" })],
      },
    });

    await waitFor(() =>
      expect(mockApi.updateHeroImage).toHaveBeenCalledWith(
        "main",
        expect.any(FormData),
      ),
    );
    expect(await screen.findByText("Image updated")).toBeInTheDocument();
  });

  test("shows immediate hero preview, blocks repeat upload, and replaces preview with server URL on success", async () => {
    const upload = createDeferred();

    URL.createObjectURL.mockReturnValue("blob:main-preview");
    mockApi.updateHeroImage.mockReturnValue(upload.promise);
    const { container } = renderProfile({
      email: "admin@test.com",
      role: "admin",
    });

    const fileInput = await screen.findByLabelText("Replace Main page hero");

    fireEvent.change(fileInput, {
      target: {
        files: [new File(["image"], "new-main.jpg", { type: "image/jpeg" })],
      },
    });

    expect(container.querySelector(".profile__hero-image")).toHaveAttribute(
      "src",
      "blob:main-preview",
    );
    expect(screen.getByRole("button", { name: /replacing/i })).toBeDisabled();

    upload.resolve({
      filename: "new-main.jpg",
      url: "https://api.test/uploads/heroes/new-main.jpg",
    });

    await waitFor(() =>
      expect(container.querySelector(".profile__hero-image")).toHaveAttribute(
        "src",
        "https://api.test/uploads/heroes/new-main.jpg",
      ),
    );
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:main-preview");
  });

  test("does not upload invalid hero file type", async () => {
    renderProfile({
      email: "admin@test.com",
      role: "admin",
    });

    const fileInput = await screen.findByLabelText("Replace Main page hero");

    fireEvent.change(fileInput, {
      target: {
        files: [new File(["text"], "hero.txt", { type: "text/plain" })],
      },
    });

    expect(mockApi.updateHeroImage).not.toHaveBeenCalled();
    expect(URL.createObjectURL).not.toHaveBeenCalled();
    expect(await screen.findByText("Use JPEG, PNG or WEBP image")).toBeInTheDocument();
  });

  test("does not upload oversized hero file", async () => {
    const file = new File(["image"], "large.jpg", { type: "image/jpeg" });

    Object.defineProperty(file, "size", {
      value: 30 * 1024 * 1024 + 1,
    });

    renderProfile({
      email: "admin@test.com",
      role: "admin",
    });

    const fileInput = await screen.findByLabelText("Replace Main page hero");

    fireEvent.change(fileInput, {
      target: {
        files: [file],
      },
    });

    expect(mockApi.updateHeroImage).not.toHaveBeenCalled();
    expect(URL.createObjectURL).not.toHaveBeenCalled();
    expect(await screen.findByText("Image must be 30 MB or smaller")).toBeInTheDocument();
  });

  test("reverts hero preview to previous image on upload error", async () => {
    URL.createObjectURL.mockReturnValue("blob:error-preview");
    mockApi.updateHeroImage.mockRejectedValue(new Error("Upload failed"));
    const { container } = renderProfile({
      email: "admin@test.com",
      role: "admin",
    });

    await waitFor(() =>
      expect(container.querySelector(".profile__hero-image")).toHaveAttribute(
        "src",
        "https://api.test/uploads/heroes/main.jpg",
      ),
    );

    fireEvent.change(await screen.findByLabelText("Replace Main page hero"), {
      target: {
        files: [new File(["image"], "new-main.jpg", { type: "image/jpeg" })],
      },
    });

    expect(container.querySelector(".profile__hero-image")).toHaveAttribute(
      "src",
      "blob:error-preview",
    );

    expect(await screen.findByText("Upload failed")).toBeInTheDocument();
    expect(container.querySelector(".profile__hero-image")).toHaveAttribute(
      "src",
      "https://api.test/uploads/heroes/main.jpg",
    );
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:error-preview");
  });

  test("revokes hero preview URL on unmount", async () => {
    const upload = createDeferred();

    URL.createObjectURL.mockReturnValue("blob:unmount-preview");
    mockApi.updateHeroImage.mockReturnValue(upload.promise);
    const { unmount } = renderProfile({
      email: "admin@test.com",
      role: "admin",
    });

    fireEvent.change(await screen.findByLabelText("Replace Main page hero"), {
      target: {
        files: [new File(["image"], "new-main.jpg", { type: "image/jpeg" })],
      },
    });

    unmount();

    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:unmount-preview");
  });

  test("updates signup toggle", async () => {
    mockApi.updateSignupEnabled.mockResolvedValue({
      signupEnabled: true,
    });
    renderProfile({
      email: "admin@test.com",
      role: "admin",
    });

    fireEvent.click(await screen.findByRole("switch", { name: /disabled/i }));

    await waitFor(() =>
      expect(mockApi.updateSignupEnabled).toHaveBeenCalledWith(true),
    );
    expect(await screen.findByText("Setting updated")).toBeInTheDocument();
  });

  test("updates accent color", async () => {
    mockApi.updateAccentColor.mockResolvedValue({
      value: "#aabbcc",
    });
    renderProfile({
      email: "admin@test.com",
      role: "admin",
    });

    fireEvent.change(await screen.findByLabelText("Accent color hex value"), {
      target: {
        value: "#aabbcc",
      },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() =>
      expect(mockApi.updateAccentColor).toHaveBeenCalledWith("#aabbcc"),
    );
    expect(await screen.findByText("Color updated")).toBeInTheDocument();
  });

  test("disables accent color save button until color changes", async () => {
    renderProfile({
      email: "admin@test.com",
      role: "admin",
    });

    const colorInput = await screen.findByLabelText("Accent color hex value");
    const saveButton = screen.getByRole("button", { name: "Save" });
    const resetButton = screen.getByRole("button", { name: "Reset" });

    expect(saveButton).toBeDisabled();
    expect(resetButton).toBeDisabled();

    fireEvent.change(colorInput, {
      target: {
        value: "#C5E7BC",
      },
    });

    expect(saveButton).toBeDisabled();
    expect(resetButton).toBeDisabled();

    fireEvent.change(colorInput, {
      target: {
        value: "#aabbcc",
      },
    });

    expect(saveButton).toBeEnabled();
    expect(resetButton).toBeEnabled();
  });

  test("resets unsaved accent color changes", async () => {
    renderProfile({
      email: "admin@test.com",
      role: "admin",
    });

    const colorInput = await screen.findByLabelText("Accent color hex value");
    const resetButton = screen.getByRole("button", { name: "Reset" });

    fireEvent.change(colorInput, {
      target: {
        value: "#aabbcc",
      },
    });

    expect(colorInput).toHaveValue("#aabbcc");
    expect(resetButton).toBeEnabled();

    fireEvent.click(resetButton);

    expect(colorInput).toHaveValue("#c5e7bc");
    expect(resetButton).toBeDisabled();
  });

  test("closes accent color picker on outside click", async () => {
    renderProfile({
      email: "admin@test.com",
      role: "admin",
    });

    const colorPicker = await screen.findByLabelText("Accent color picker");
    const blurSpy = jest.spyOn(colorPicker, "blur");

    colorPicker.focus();
    fireEvent.pointerDown(document.body);

    expect(blurSpy).toHaveBeenCalled();
  });
});
