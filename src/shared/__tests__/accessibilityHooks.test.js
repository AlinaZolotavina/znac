import { useRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import useInitialFocus from "../hooks/useInitialFocus";
import useFocusTrap from "../hooks/useFocusTrap";
import useReturnFocus from "../hooks/useReturnFocus";
import useCloseOnEsc from "../hooks/useCloseOnEsc";

function FocusTestDialog({ isOpen, children }) {
  const containerRef = useRef(null);

  useReturnFocus(isOpen);
  useInitialFocus(isOpen, containerRef);
  useFocusTrap(isOpen, containerRef);

  if (!isOpen) {
    return null;
  }

  return (
    <div ref={containerRef} tabIndex={-1} data-testid="dialog">
      {children}
    </div>
  );
}

function EscTestDialog({ isOpen, onClose }) {
  useCloseOnEsc(isOpen, onClose);

  return <button>Outside action</button>;
}

describe("accessibility hooks", () => {
  test("useInitialFocus focuses the first available interactive element", () => {
    render(
      <FocusTestDialog isOpen={true}>
        <button disabled>Disabled</button>
        <button hidden>Hidden</button>
        <button>First button</button>
        <a href="/test">Second link</a>
      </FocusTestDialog>,
    );

    expect(screen.getByRole("button", { name: "First button" })).toHaveFocus();
  });

  test("useInitialFocus focuses the container when there are no focusable children", () => {
    render(
      <FocusTestDialog isOpen={true}>
        <p>Dialog content</p>
      </FocusTestDialog>,
    );

    expect(screen.getByTestId("dialog")).toHaveFocus();
  });

  test("useInitialFocus does not move focus while closed", () => {
    render(
      <>
        <button>Trigger</button>
        <FocusTestDialog isOpen={false}>
          <button>Inside dialog</button>
        </FocusTestDialog>
      </>,
    );

    screen.getByRole("button", { name: "Trigger" }).focus();

    expect(screen.getByRole("button", { name: "Trigger" })).toHaveFocus();
  });

  test("useFocusTrap moves focus from the last element to the first on Tab", () => {
    render(
      <FocusTestDialog isOpen={true}>
        <button>First</button>
        <button>Last</button>
      </FocusTestDialog>,
    );

    const firstButton = screen.getByRole("button", { name: "First" });
    const lastButton = screen.getByRole("button", { name: "Last" });

    lastButton.focus();
    fireEvent.keyDown(lastButton, { key: "Tab" });

    expect(firstButton).toHaveFocus();
  });

  test("useFocusTrap moves focus from the first element to the last on Shift+Tab", () => {
    render(
      <FocusTestDialog isOpen={true}>
        <button>First</button>
        <button>Last</button>
      </FocusTestDialog>,
    );

    const firstButton = screen.getByRole("button", { name: "First" });
    const lastButton = screen.getByRole("button", { name: "Last" });

    firstButton.focus();
    fireEvent.keyDown(firstButton, { key: "Tab", shiftKey: true });

    expect(lastButton).toHaveFocus();
  });

  test("useFocusTrap focuses the container when there are no focusable children", () => {
    render(
      <FocusTestDialog isOpen={true}>
        <p>Dialog content</p>
      </FocusTestDialog>,
    );

    const dialog = screen.getByTestId("dialog");

    fireEvent.keyDown(dialog, { key: "Tab" });

    expect(dialog).toHaveFocus();
  });

  test("useFocusTrap does not trap focus while closed", () => {
    render(
      <>
        <button>Outside</button>
        <FocusTestDialog isOpen={false}>
          <button>Inside</button>
        </FocusTestDialog>
      </>,
    );

    const outsideButton = screen.getByRole("button", { name: "Outside" });
    outsideButton.focus();
    fireEvent.keyDown(outsideButton, { key: "Tab" });

    expect(outsideButton).toHaveFocus();
  });

  test("useFocusTrap removes the keydown listener when closed", () => {
    const addEventListenerSpy = jest.spyOn(document, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(document, "removeEventListener");

    const { rerender } = render(
      <FocusTestDialog isOpen={true}>
        <button>Inside</button>
      </FocusTestDialog>,
    );

    const keydownHandler = addEventListenerSpy.mock.calls.find(
      ([eventName]) => eventName === "keydown",
    )?.[1];

    rerender(
      <FocusTestDialog isOpen={false}>
        <button>Inside</button>
      </FocusTestDialog>,
    );

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      keydownHandler,
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  test("useFocusTrap adds listeners only while open", () => {
    const addEventListenerSpy = jest.spyOn(document, "addEventListener");

    const { rerender } = render(
      <FocusTestDialog isOpen={false}>
        <button>Inside</button>
      </FocusTestDialog>,
    );

    expect(
      addEventListenerSpy.mock.calls.some(
        ([eventName]) => eventName === "keydown",
      ),
    ).toBe(false);

    rerender(
      <FocusTestDialog isOpen={true}>
        <button>Inside</button>
      </FocusTestDialog>,
    );

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function),
    );

    addEventListenerSpy.mockRestore();
  });

  test("useFocusTrap does not handle Enter, Space or Escape", () => {
    render(
      <FocusTestDialog isOpen={true}>
        <button>Inside</button>
      </FocusTestDialog>,
    );

    const insideButton = screen.getByRole("button", { name: "Inside" });

    insideButton.focus();

    const enterEvent = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
      cancelable: true,
    });
    const spaceEvent = new KeyboardEvent("keydown", {
      key: " ",
      bubbles: true,
      cancelable: true,
    });
    const escapeEvent = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    });

    document.dispatchEvent(enterEvent);
    expect(enterEvent.defaultPrevented).toBe(false);
    expect(insideButton).toHaveFocus();

    document.dispatchEvent(spaceEvent);
    expect(spaceEvent.defaultPrevented).toBe(false);
    expect(insideButton).toHaveFocus();

    document.dispatchEvent(escapeEvent);
    expect(escapeEvent.defaultPrevented).toBe(false);
    expect(insideButton).toHaveFocus();
  });

  test("useCloseOnEsc handles only Escape", () => {
    const onClose = jest.fn();

    render(<EscTestDialog isOpen={true} onClose={onClose} />);

    fireEvent.keyDown(window, { key: "Enter" });
    fireEvent.keyDown(window, { key: " " });
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("useReturnFocus returns focus to the element active before opening", () => {
    function TestComponent({ isOpen }) {
      return (
        <>
          <button>Open dialog</button>
          <FocusTestDialog isOpen={isOpen}>
            <button>Dialog action</button>
          </FocusTestDialog>
        </>
      );
    }

    const { rerender } = render(<TestComponent isOpen={false} />);
    const triggerButton = screen.getByRole("button", { name: "Open dialog" });

    triggerButton.focus();
    rerender(<TestComponent isOpen={true} />);
    expect(screen.getByRole("button", { name: "Dialog action" })).toHaveFocus();

    rerender(<TestComponent isOpen={false} />);

    expect(triggerButton).toHaveFocus();
  });

  test("useReturnFocus skips removed previous elements", () => {
    function TestComponent({ isOpen, showTrigger }) {
      return (
        <>
          {showTrigger && <button>Open dialog</button>}
          <FocusTestDialog isOpen={isOpen}>
            <button>Dialog action</button>
          </FocusTestDialog>
        </>
      );
    }

    const { rerender } = render(
      <TestComponent isOpen={false} showTrigger={true} />,
    );
    screen.getByRole("button", { name: "Open dialog" }).focus();

    rerender(<TestComponent isOpen={true} showTrigger={true} />);
    rerender(<TestComponent isOpen={false} showTrigger={false} />);

    expect(screen.queryByRole("button", { name: "Open dialog" })).toBeNull();
  });

  test("useReturnFocus stores the active element on each opening", () => {
    function TestComponent({ isOpen }) {
      return (
        <>
          <button>First trigger</button>
          <button>Second trigger</button>
          <FocusTestDialog isOpen={isOpen}>
            <button>Dialog action</button>
          </FocusTestDialog>
        </>
      );
    }

    const { rerender } = render(<TestComponent isOpen={false} />);
    const firstTrigger = screen.getByRole("button", {
      name: "First trigger",
    });
    const secondTrigger = screen.getByRole("button", {
      name: "Second trigger",
    });

    firstTrigger.focus();
    rerender(<TestComponent isOpen={true} />);
    rerender(<TestComponent isOpen={false} />);

    expect(firstTrigger).toHaveFocus();

    secondTrigger.focus();
    rerender(<TestComponent isOpen={true} />);
    rerender(<TestComponent isOpen={false} />);

    expect(secondTrigger).toHaveFocus();
  });

});
