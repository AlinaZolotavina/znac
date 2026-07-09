import { fireEvent, screen, waitFor } from "@testing-library/react";
import AddPhoto from "../components/AddPhoto";
import { renderWithProviders } from "../../../test/renderWithProviders";

function renderAddPhoto(overrides = {}) {
  const props = {
    loggedIn: true,
    onHomeClick: jest.fn(),
    onBlogClick: jest.fn(),
    onGalleryClick: jest.fn(),
    onContactClick: jest.fn(),
    onMenuClick: jest.fn(),
    isSendingReq: false,
    onAddPhotoViaLink: jest.fn().mockResolvedValue(),
    onUploadPhotoToServer: jest.fn().mockResolvedValue(),
    email: "admin@test.com",
    onLogout: jest.fn(),
    ...overrides,
  };

  return {
    props,
    ...renderWithProviders(<AddPhoto {...props} />),
  };
}

describe("upload photo form", () => {
  test("shows selected files placeholder", () => {
    renderAddPhoto();

    expect(screen.getByText("Photo not selected")).toBeInTheDocument();
  });

  test("shows validation error when too many files are selected", async () => {
    renderAddPhoto();

    const files = Array.from(
      { length: 11 },
      (_, index) =>
        new File(["file"], `photo-${index}.jpg`, { type: "image/jpeg" }),
    );

    fireEvent.change(screen.getByLabelText(/select photo/i), {
      target: { files },
    });

    expect(
      await screen.findByText(/Maximum allowed is 10/i),
    ).toBeInTheDocument();
  });

  test("adds photo via link", async () => {
    const { props } = renderAddPhoto();

    fireEvent.click(screen.getByText("Add photo via link"));
    fireEvent.change(screen.getByPlaceholderText("Paste image link"), {
      target: { value: "https://example.com/photo.jpg" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Enter hashtags separated by spaces"),
      {
        target: { value: "travel summer" },
      },
    );

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Add photo" })).toBeEnabled(),
    );

    fireEvent.click(screen.getByRole("button", { name: "Add photo" }));

    await waitFor(() =>
      expect(props.onAddPhotoViaLink).toHaveBeenCalledWith({
        link: "https://example.com/photo.jpg",
        hashtags: "travel summer",
        views: 0,
      }),
    );
    expect(await screen.findByText("Photo not selected")).toBeInTheDocument();
  });

  test("disables submit while request is sending", () => {
    renderAddPhoto({ isSendingReq: true });

    expect(screen.getByRole("button", { name: "Add photo" })).toBeDisabled();
  });
});
