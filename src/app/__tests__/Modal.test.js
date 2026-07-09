import { fireEvent, screen } from "@testing-library/react";
import Modal from "../components/Modal";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("Modal", () => {
  test("does not render when closed", () => {
    const { container } = renderWithProviders(
      <Modal
        isOpen={false}
        status="success"
        message="Saved"
        onClose={jest.fn()}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  test("renders message and closes by close button", () => {
    const onClose = jest.fn();

    renderWithProviders(
      <Modal
        isOpen
        status="success"
        message="Saved successfully"
        onClose={onClose}
      />,
    );

    expect(screen.getByText("Saved successfully")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button"));

    expect(onClose).toHaveBeenCalled();
  });
});
