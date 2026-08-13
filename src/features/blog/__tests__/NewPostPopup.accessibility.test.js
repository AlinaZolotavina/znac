import { useState } from "react";
import { createEvent, fireEvent, screen } from "@testing-library/react";
import NewPostPopup from "../components/NewPostPopup";
import { renderWithProviders } from "../../../test/renderWithProviders";
import { getFocusableElements } from "../../../shared/utils/focusUtils";
import iconButtons from "../utils/iconButtons";

function NewPostPopupController({ removeTriggerOnOpen = false }) {
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
      {isTriggerVisible && <button onClick={handleOpen}>Create Post</button>}
      <NewPostPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isSendingReq={false}
        onAddPost={jest.fn()}
      />
    </>
  );
}

describe("NewPostPopup accessibility", () => {
  afterEach(() => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  });

  test("opens and moves focus to the first form control", () => {
    renderWithProviders(<NewPostPopupController />);

    const trigger = screen.getByRole("button", { name: "Create Post" });

    trigger.focus();
    fireEvent.click(trigger);

    expect(
      screen.getByRole("dialog", { name: "New post" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Web development" })).toHaveFocus();
    expect(document.activeElement).toBe(
      screen.getByRole("radio", { name: "Web development" }),
    );
    expect(
      screen.getByRole("radio", { name: "Web development" }),
    ).not.toBeChecked();
  });

  test("does not render when closed", () => {
    renderWithProviders(
      <NewPostPopup
        isOpen={false}
        onClose={jest.fn()}
        isSendingReq={false}
        onAddPost={jest.fn()}
      />,
    );

    expect(
      screen.queryByRole("dialog", { name: "New post" }),
    ).not.toBeInTheDocument();
  });

  test("keeps native radio inputs in the focusable order", () => {
    renderWithProviders(<NewPostPopupController />);

    const trigger = screen.getByRole("button", { name: "Create Post" });

    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "New post" });
    const firstThemeRadio = screen.getByRole("radio", {
      name: "Web development",
    });
    const firstIconRadio = screen.getByRole("radio", { name: /css icon/i });
    const focusableElements = getFocusableElements(dialog);

    expect(firstThemeRadio.tabIndex).toBe(0);
    expect(firstIconRadio.tabIndex).toBe(0);
    expect(focusableElements).toContain(firstThemeRadio);
    expect(focusableElements).toContain(firstIconRadio);
    expect(focusableElements.indexOf(firstThemeRadio)).toBeLessThan(
      focusableElements.indexOf(
        screen.getByRole("button", { name: "Close dialog" }),
      ),
    );
  });

  test("selects radio by native input interaction", () => {
    renderWithProviders(<NewPostPopupController />);

    const trigger = screen.getByRole("button", { name: "Create Post" });

    trigger.focus();
    fireEvent.click(trigger);

    const firstThemeRadio = screen.getByRole("radio", {
      name: "Web development",
    });

    expect(firstThemeRadio).not.toBeChecked();

    firstThemeRadio.focus();
    fireEvent.click(firstThemeRadio);

    expect(firstThemeRadio).toBeChecked();
  });

  test("selects icon by clicking its native radio control", () => {
    renderWithProviders(<NewPostPopupController />);

    const trigger = screen.getByRole("button", { name: "Create Post" });

    trigger.focus();
    fireEvent.click(trigger);

    const cssIcon = screen.getByRole("radio", { name: /css icon/i });

    expect(cssIcon).not.toBeChecked();

    fireEvent.click(cssIcon);

    expect(cssIcon).toBeChecked();
  });

  test("moves radio focus with arrow keys without changing selected radio", () => {
    renderWithProviders(<NewPostPopupController />);

    const trigger = screen.getByRole("button", { name: "Create Post" });

    trigger.focus();
    fireEvent.click(trigger);

    const firstThemeRadio = screen.getByRole("radio", {
      name: "Web development",
    });
    const secondThemeRadio = screen.getByRole("radio", {
      name: "Web design",
    });
    const arrowDownEvent = createEvent.keyDown(firstThemeRadio, {
      key: "ArrowDown",
    });

    firstThemeRadio.focus();
    fireEvent(firstThemeRadio, arrowDownEvent);

    expect(arrowDownEvent.defaultPrevented).toBe(true);
    expect(secondThemeRadio).toHaveFocus();
    expect(firstThemeRadio).not.toBeChecked();
    expect(secondThemeRadio).not.toBeChecked();
  });

  test("keeps Tab focus inside the popup", () => {
    renderWithProviders(<NewPostPopupController />);

    const trigger = screen.getByRole("button", { name: "Create Post" });

    trigger.focus();
    fireEvent.click(trigger);

    const firstControl = screen.getByRole("radio", { name: "Web development" });
    const closeButton = screen.getByRole("button", { name: "Close dialog" });

    closeButton.focus();
    fireEvent.keyDown(document, { key: "Tab" });

    expect(firstControl).toHaveFocus();
  });

  test("keeps flip buttons working", () => {
    renderWithProviders(<NewPostPopupController />);

    const trigger = screen.getByRole("button", { name: "Create Post" });

    trigger.focus();
    fireEvent.click(trigger);

    expect(screen.getByRole("radio", { name: /css icon/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /react icon/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next post icon" }));

    expect(screen.queryByRole("radio", { name: /css icon/i })).toBeNull();
    expect(
      screen.getByRole("radio", { name: /illustrations icon/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /illustrations icon/i })).toHaveFocus();
  });

  test("moves icon focus through the full carousel with arrow keys without selecting icon", () => {
    renderWithProviders(<NewPostPopupController />);

    const trigger = screen.getByRole("button", { name: "Create Post" });

    trigger.focus();
    fireEvent.click(trigger);

    const cssIcon = screen.getByRole("radio", { name: /css icon/i });
    const arrowRightEvent = createEvent.keyDown(cssIcon, {
      key: "ArrowRight",
    });

    cssIcon.focus();
    fireEvent(cssIcon, arrowRightEvent);

    expect(arrowRightEvent.defaultPrevented).toBe(true);
    expect(screen.getByRole("radio", { name: /js icon/i })).toHaveFocus();
    expect(screen.getByRole("radio", { name: /react icon/i })).toBeInTheDocument();
    expect(cssIcon).not.toBeChecked();

    const markupIcon = screen.getByRole("radio", { name: /markup icon/i });
    const slideRightEvent = createEvent.keyDown(markupIcon, {
      key: "ArrowRight",
    });

    markupIcon.focus();
    fireEvent(markupIcon, slideRightEvent);

    expect(slideRightEvent.defaultPrevented).toBe(true);
    expect(
      screen.getByRole("radio", { name: /react icon/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /react icon/i })).toHaveFocus();
    expect(markupIcon).not.toBeChecked();
  });

  test("does not wrap icon focus at carousel edges", () => {
    renderWithProviders(<NewPostPopupController />);

    const trigger = screen.getByRole("button", { name: "Create Post" });

    trigger.focus();
    fireEvent.click(trigger);

    const firstIcon = screen.getByRole("radio", { name: /css icon/i });
    const arrowLeftEvent = createEvent.keyDown(firstIcon, {
      key: "ArrowLeft",
    });

    firstIcon.focus();
    fireEvent(firstIcon, arrowLeftEvent);

    expect(arrowLeftEvent.defaultPrevented).toBe(true);
    expect(firstIcon).toHaveFocus();
    expect(screen.queryByRole("radio", { name: /cat icon/i })).toBeNull();

    let focusedIcon = firstIcon;
    for (let i = 0; i < iconButtons.length - 1; i += 1) {
      const arrowRightEvent = createEvent.keyDown(focusedIcon, {
        key: "ArrowRight",
      });

      fireEvent(focusedIcon, arrowRightEvent);
      focusedIcon = document.activeElement;
    }

    const lastIcon = screen.getByRole("radio", { name: /cat icon/i });
    const edgeRightEvent = createEvent.keyDown(lastIcon, {
      key: "ArrowRight",
    });

    expect(lastIcon).toHaveFocus();

    fireEvent(lastIcon, edgeRightEvent);

    expect(edgeRightEvent.defaultPrevented).toBe(true);
    expect(lastIcon).toHaveFocus();
    expect(screen.queryByRole("radio", { name: /css icon/i })).toBeNull();
  });

  test("closes by Escape, close button and overlay", () => {
    renderWithProviders(<NewPostPopupController />);

    const trigger = screen.getByRole("button", { name: "Create Post" });

    trigger.focus();
    fireEvent.click(trigger);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(trigger).toHaveFocus();
    expect(
      screen.queryByRole("dialog", { name: "New post" }),
    ).not.toBeInTheDocument();

    trigger.focus();
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("button", { name: "Close dialog" }));
    expect(trigger).toHaveFocus();

    trigger.focus();
    fireEvent.click(trigger);
    fireEvent.mouseDown(
      screen.getByRole("dialog", { name: "New post" }).parentElement,
    );
    expect(trigger).toHaveFocus();
  });

  test("supports repeated opening and removed trigger without errors", () => {
    const { rerender } = renderWithProviders(<NewPostPopupController />);

    const trigger = screen.getByRole("button", { name: "Create Post" });

    trigger.focus();
    fireEvent.click(trigger);
    fireEvent.keyDown(window, { key: "Escape" });
    trigger.focus();
    fireEvent.click(trigger);

    expect(screen.getByRole("radio", { name: "Web development" })).toHaveFocus();

    rerender(<NewPostPopupController removeTriggerOnOpen />);

    const removedTrigger = screen.getByRole("button", { name: "Create Post" });

    removedTrigger.focus();
    fireEvent.click(removedTrigger);

    expect(() => fireEvent.keyDown(window, { key: "Escape" })).not.toThrow();
  });
});
