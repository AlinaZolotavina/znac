import { useState } from "react";
import { fireEvent, screen } from "@testing-library/react";
import Menu from "../components/Menu";
import { renderWithProviders } from "../../test/renderWithProviders";

function renderMenu(props = {}) {
  const defaultProps = {
    isOpen: true,
    loggedIn: false,
    onHomeClick: jest.fn(),
    onProfileClick: jest.fn(),
    onAddPhotoClick: jest.fn(),
    onGalleryClick: jest.fn(),
    onBlogClick: jest.fn(),
    onContactClick: jest.fn(),
    onClose: jest.fn(),
    onLogout: jest.fn(),
  };

  return renderWithProviders(<Menu {...defaultProps} {...props} />);
}

function MenuController({ showSecondTrigger = true }) {
  const [isOpen, setIsOpen] = useState(false);

  function openMenu() {
    setIsOpen(true);
  }

  return (
    <>
      <button onClick={openMenu}>Open menu A</button>
      {showSecondTrigger && <button onClick={openMenu}>Open menu B</button>}
      <Menu
        isOpen={isOpen}
        loggedIn={false}
        onHomeClick={() => setIsOpen(false)}
        onProfileClick={() => setIsOpen(false)}
        onAddPhotoClick={() => setIsOpen(false)}
        onGalleryClick={jest.fn()}
        onBlogClick={() => setIsOpen(false)}
        onContactClick={jest.fn()}
        onClose={() => setIsOpen(false)}
        onLogout={jest.fn()}
      />
    </>
  );
}

describe("Menu", () => {
  afterEach(() => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  });

  test("moves focus inside when opened", () => {
    renderMenu();

    expect(screen.getByRole("link", { name: "HOME" })).toHaveFocus();
  });

  test("does not render when closed", () => {
    renderMenu({ isOpen: false });

    expect(
      screen.queryByRole("navigation", { name: "Main navigation" }),
    ).not.toBeInTheDocument();
  });

  test("keeps Tab focus inside the menu", () => {
    renderMenu();

    const firstLink = screen.getByRole("link", { name: "HOME" });
    const closeButton = screen.getByRole("button", { name: "Close menu" });

    closeButton.focus();
    fireEvent.keyDown(document, { key: "Tab" });

    expect(firstLink).toHaveFocus();
  });

  test("closes by Escape and overlay click", () => {
    const onClose = jest.fn();
    renderMenu({ onClose });

    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.mouseDown(screen.getByRole("navigation", {
      name: "Main navigation",
    }));

    expect(onClose).toHaveBeenCalledTimes(2);
  });

  test("does not close on child mousedown", () => {
    const onClose = jest.fn();
    renderMenu({ onClose });

    fireEvent.mouseDown(screen.getByRole("link", { name: "HOME" }));

    expect(onClose).not.toHaveBeenCalled();
  });

  test("close button closes menu", () => {
    const onClose = jest.fn();
    renderMenu({ onClose });

    fireEvent.click(screen.getByRole("button", { name: "Close menu" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("keeps existing action handlers", () => {
    const onClose = jest.fn();
    const onGalleryClick = jest.fn();
    const onContactClick = jest.fn();

    renderMenu({ onClose, onGalleryClick, onContactClick });

    fireEvent.click(screen.getByRole("button", { name: "GALLERY" }));
    fireEvent.click(screen.getByRole("button", { name: "CONTACT" }));

    expect(onGalleryClick).toHaveBeenCalledTimes(1);
    expect(onContactClick).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  test("locks page scroll while open", () => {
    renderMenu();

    expect(document.body).toHaveStyle({ overflow: "hidden" });
    expect(document.documentElement).toHaveStyle({ overflow: "hidden" });
  });

  test("returns focus to the current trigger after Escape", () => {
    renderWithProviders(<MenuController />);

    const firstTrigger = screen.getByRole("button", { name: "Open menu A" });
    const secondTrigger = screen.getByRole("button", { name: "Open menu B" });

    firstTrigger.focus();
    fireEvent.click(firstTrigger);
    fireEvent.keyDown(window, { key: "Escape" });

    expect(firstTrigger).toHaveFocus();
    expect(
      screen.queryByRole("navigation", { name: "Main navigation" }),
    ).not.toBeInTheDocument();

    secondTrigger.focus();
    fireEvent.click(secondTrigger);
    fireEvent.keyDown(window, { key: "Escape" });

    expect(secondTrigger).toHaveFocus();
  });

  test("does not throw when trigger is removed before close", () => {
    function RemovedTriggerController() {
      const [isOpen, setIsOpen] = useState(false);
      const [showTrigger, setShowTrigger] = useState(true);

      function openMenu() {
        setIsOpen(true);
        setShowTrigger(false);
      }

      return (
        <>
          {showTrigger && <button onClick={openMenu}>Open menu</button>}
          <Menu
            isOpen={isOpen}
            loggedIn={false}
            onHomeClick={() => setIsOpen(false)}
            onProfileClick={() => setIsOpen(false)}
            onAddPhotoClick={() => setIsOpen(false)}
            onGalleryClick={jest.fn()}
            onBlogClick={() => setIsOpen(false)}
            onContactClick={jest.fn()}
            onClose={() => setIsOpen(false)}
            onLogout={jest.fn()}
          />
        </>
      );
    }

    renderWithProviders(<RemovedTriggerController />);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

    expect(() => fireEvent.keyDown(window, { key: "Escape" })).not.toThrow();
  });

  test("keeps NavLink activation on the link itself", () => {
    const onHomeClick = jest.fn();
    renderMenu({ onHomeClick });

    const homeLink = screen.getByRole("link", { name: "HOME" });

    fireEvent.click(homeLink);

    expect(onHomeClick).toHaveBeenCalledTimes(1);
  });
});
