import { screen, within } from "@testing-library/react";
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
  const heading = within(dialog).getByRole("heading", { name, level: 2 });

  expect(dialog).toHaveAttribute("aria-modal", "true");
  expect(dialog).toHaveAttribute("aria-labelledby", heading.id);
  expect(heading).toBeInTheDocument();
  expect(heading).toHaveTextContent(name);
  expect(heading).toBeVisible();
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
