import { screen } from "@testing-library/react";
import { CurrentUserContext } from "../../../contexts/CurrentUserContext";
import { renderWithProviders } from "../../../test/renderWithProviders";
import EditEmailModal from "../components/EditEmailModal";
import EditPasswordModal from "../components/EditPasswordModal";

function renderWithUser(ui) {
  return renderWithProviders(
    <CurrentUserContext.Provider value={{ email: "alina@test.com" }}>
      {ui}
    </CurrentUserContext.Provider>,
  );
}

function expectLabelledDialog(name) {
  const dialog = screen.getByRole("dialog", { name });
  const labelledBy = dialog.getAttribute("aria-labelledby");
  const heading = document.getElementById(labelledBy);

  expect(dialog).toHaveAttribute("aria-modal", "true");
  expect(labelledBy).toBeTruthy();
  expect(heading).toBeInTheDocument();
  expect(heading).toHaveTextContent(name);
  expect(heading.tagName).toBe("H2");
}

test("EditEmailModal is labelled by its visible heading", () => {
  renderWithUser(
    <EditEmailModal
      isOpen
      onClose={jest.fn()}
      isSendingReq={false}
      onRequestEmailChange={jest.fn()}
    />,
  );

  expectLabelledDialog("Edit e-mail");
});

test("EditPasswordModal is labelled by its visible heading", () => {
  renderWithUser(
    <EditPasswordModal
      isOpen
      onClose={jest.fn()}
      isSendingReq={false}
      onUpdatePassword={jest.fn()}
    />,
  );

  expectLabelledDialog("Edit password");
});
