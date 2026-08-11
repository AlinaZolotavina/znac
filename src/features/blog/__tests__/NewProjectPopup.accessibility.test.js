import { useState } from "react";
import { fireEvent, screen } from "@testing-library/react";
import NewProjectPopup from "../components/NewProjectPopup";
import { renderWithProviders } from "../../../test/renderWithProviders";

function NewProjectPopupController({ removeTriggerOnOpen = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTriggerVisible, setIsTriggerVisible] = useState(true);

  function handleOpen() {
    setIsOpen(true);

    if (removeTriggerOnOpen) {
      setIsTriggerVisible(false);
    }
  }

  return (
    <>
      {isTriggerVisible && (
        <button onClick={handleOpen}>Create Project</button>
      )}
      <NewProjectPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onAddProject={jest.fn()}
        isSendingReq={false}
      />
    </>
  );
}

describe("NewProjectPopup accessibility", () => {
  afterEach(() => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  });

  test("opens and moves focus to the first form input", () => {
    renderWithProviders(<NewProjectPopupController />);

    const trigger = screen.getByRole("button", { name: "Create Project" });

    trigger.focus();
    fireEvent.click(trigger);

    expect(
      screen.getByRole("dialog", { name: "New project" }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Title")).toHaveFocus();
    expect(document.activeElement).toBe(screen.getByPlaceholderText("Title"));
  });

  test("does not render when closed", () => {
    renderWithProviders(
      <NewProjectPopup
        isOpen={false}
        onClose={jest.fn()}
        onAddProject={jest.fn()}
        isSendingReq={false}
      />,
    );

    expect(
      screen.queryByRole("dialog", { name: "New project" }),
    ).not.toBeInTheDocument();
  });

  test("keeps Tab focus inside the popup", () => {
    renderWithProviders(<NewProjectPopupController />);

    const trigger = screen.getByRole("button", { name: "Create Project" });

    trigger.focus();
    fireEvent.click(trigger);

    const firstControl = screen.getByPlaceholderText("Title");
    const closeButton = screen.getByRole("button", { name: "Close dialog" });

    closeButton.focus();
    fireEvent.keyDown(document, { key: "Tab" });

    expect(firstControl).toHaveFocus();
  });

  test("closes by Escape, close button and overlay", () => {
    renderWithProviders(<NewProjectPopupController />);

    const trigger = screen.getByRole("button", { name: "Create Project" });

    trigger.focus();
    fireEvent.click(trigger);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(trigger).toHaveFocus();
    expect(
      screen.queryByRole("dialog", { name: "New project" }),
    ).not.toBeInTheDocument();

    trigger.focus();
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("button", { name: "Close dialog" }));
    expect(trigger).toHaveFocus();

    trigger.focus();
    fireEvent.click(trigger);
    fireEvent.mouseDown(
      screen.getByRole("dialog", { name: "New project" }).parentElement,
    );
    expect(trigger).toHaveFocus();
  });

  test("supports repeated opening and removed trigger without errors", () => {
    const { rerender } = renderWithProviders(<NewProjectPopupController />);

    const trigger = screen.getByRole("button", { name: "Create Project" });

    trigger.focus();
    fireEvent.click(trigger);
    fireEvent.keyDown(window, { key: "Escape" });
    trigger.focus();
    fireEvent.click(trigger);

    expect(screen.getByPlaceholderText("Title")).toHaveFocus();

    rerender(<NewProjectPopupController removeTriggerOnOpen />);

    const removedTrigger = screen.getByRole("button", { name: "Create Project" });

    removedTrigger.focus();
    fireEvent.click(removedTrigger);

    expect(() => fireEvent.keyDown(window, { key: "Escape" })).not.toThrow();
  });
});
