import { useState } from "react";
import { fireEvent, screen } from "@testing-library/react";
import Modal from "../components/Modal";
import { renderWithProviders } from "../../test/renderWithProviders";

function ModalController() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open modal</button>
      <Modal
        isOpen={isOpen}
        status="success"
        message="Saved successfully"
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

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

  test("has dialog semantics connected to its heading", () => {
    renderWithProviders(
      <Modal
        isOpen
        status="success"
        message="Saved successfully"
        onClose={jest.fn()}
      />,
    );

    const dialog = screen.getByRole("dialog", {
      name: "Status message",
    });
    const labelledBy = dialog.getAttribute("aria-labelledby");
    const heading = document.getElementById(labelledBy);

    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Status message");
    expect(heading.tagName).toBe("H2");
  });

  test("announces success messages with status semantics", () => {
    renderWithProviders(
      <Modal
        isOpen
        status="success"
        message="Saved successfully"
        onClose={jest.fn()}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Saved successfully",
    );
  });

  test("announces error messages with alert semantics", () => {
    renderWithProviders(
      <Modal
        isOpen
        status="error"
        message="Failed to save changes"
        onClose={jest.fn()}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Failed to save changes",
    );
  });

  test("moves focus inside and returns it to trigger after close", () => {
    renderWithProviders(<ModalController />);

    const trigger = screen.getByRole("button", { name: "Open modal" });
    trigger.focus();
    fireEvent.click(trigger);

    const closeButton = screen.getByRole("button", { name: "Close dialog" });

    expect(closeButton).toHaveFocus();

    fireEvent.click(closeButton);

    expect(trigger).toHaveFocus();
  });

  test("keeps Tab focus inside the modal", () => {
    renderWithProviders(<ModalController />);

    fireEvent.click(screen.getByRole("button", { name: "Open modal" }));

    const closeButton = screen.getByRole("button", { name: "Close dialog" });
    closeButton.focus();
    fireEvent.keyDown(document, { key: "Tab" });

    expect(closeButton).toHaveFocus();
  });

  test("closes by Escape", () => {
    renderWithProviders(<ModalController />);

    fireEvent.click(screen.getByRole("button", { name: "Open modal" }));
    fireEvent.keyDown(window, { key: "Escape" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("closes by overlay click", () => {
    renderWithProviders(<ModalController />);

    fireEvent.click(screen.getByRole("button", { name: "Open modal" }));

    const overlay = screen.getByRole("dialog").parentElement;
    fireEvent.mouseDown(overlay);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("locks page scroll while open and restores it after close", () => {
    renderWithProviders(<ModalController />);

    fireEvent.click(screen.getByRole("button", { name: "Open modal" }));

    expect(document.body).toHaveStyle({ overflow: "hidden" });
    expect(document.documentElement).toHaveStyle({ overflow: "hidden" });

    fireEvent.click(screen.getByRole("button", { name: "Close dialog" }));

    expect(document.body.style.overflow).toBe("");
    expect(document.documentElement.style.overflow).toBe("");
  });
});
