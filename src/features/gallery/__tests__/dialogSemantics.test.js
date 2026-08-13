import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../test/renderWithProviders";
import { photos } from "../../../test/fixtures/photo";
import DeletePhotoModal from "../components/DeletePhotoModal";
import PhotoPopup from "../components/PhotoPopup";

test("DeletePhotoModal is labelled by its visible heading", () => {
  renderWithProviders(
    <DeletePhotoModal
      isOpen
      photo={photos[0]}
      onClose={jest.fn()}
      onDeletePhoto={jest.fn()}
    />,
  );

  const dialog = screen.getByRole("dialog", {
    name: "Are you sure you want to delete the photo?",
  });
  const labelledBy = dialog.getAttribute("aria-labelledby");
  const heading = document.getElementById(labelledBy);

  expect(dialog).toHaveAttribute("aria-modal", "true");
  expect(heading).toBeInTheDocument();
  expect(heading).toHaveTextContent("Are you sure you want to delete the photo?");
  expect(heading.tagName).toBe("H2");
});

test("PhotoPopup has dialog semantics with aria-label because it has no visible heading", () => {
  renderWithProviders(
    <PhotoPopup
      loggedIn={false}
      isOpen
      photo={photos[0]}
      photoHashtags={photos[0].hashtags}
      views={photos[0].views}
      onClose={jest.fn()}
      onHashtagClick={jest.fn()}
      areHashtagsEditing={false}
      onEditHashtags={jest.fn()}
      isSendingReq={false}
      onEditHashtagsBtnClick={jest.fn()}
      onPhotoFlip={jest.fn()}
      isLeftFlipDisabled
      isRightFlipDisabled
    />,
  );

  const dialog = screen.getByRole("dialog", { name: "Photo preview" });

  expect(dialog).toHaveAttribute("aria-modal", "true");
  expect(dialog).toHaveAttribute("aria-label", "Photo preview");
  expect(dialog).not.toHaveAttribute("aria-labelledby");
});
