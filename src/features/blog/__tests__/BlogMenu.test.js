import { useState } from "react";
import { fireEvent, screen } from "@testing-library/react";
import BlogMenu from "../components/BlogMenu";
import { renderWithProviders } from "../../../test/renderWithProviders";

function renderBlogMenu(props = {}) {
  const defaultProps = {
    isOpen: true,
    activeBlogPage: "Home",
    loggedIn: false,
    currentUser: null,
    onLogout: jest.fn(),
    onHomeClick: jest.fn(),
    onPostsClick: jest.fn(),
    onProjectsClick: jest.fn(),
    onAboutClick: jest.fn(),
    onClose: jest.fn(),
  };

  return renderWithProviders(<BlogMenu {...defaultProps} {...props} />);
}

function BlogMenuController() {
  const [isOpen, setIsOpen] = useState(false);

  function openMenu() {
    setIsOpen(true);
  }

  return (
    <>
      <button onClick={openMenu}>Open blog menu A</button>
      <button onClick={openMenu}>Open blog menu B</button>
      <BlogMenu
        isOpen={isOpen}
        activeBlogPage="Home"
        loggedIn={false}
        currentUser={null}
        onLogout={jest.fn()}
        onHomeClick={() => setIsOpen(false)}
        onPostsClick={() => setIsOpen(false)}
        onProjectsClick={() => setIsOpen(false)}
        onAboutClick={() => setIsOpen(false)}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

describe("BlogMenu", () => {
  afterEach(() => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  });

  test("moves focus inside when opened", () => {
    renderBlogMenu();

    expect(screen.getByRole("link", { name: "Home" })).toHaveFocus();
  });

  test("does not render when closed", () => {
    renderBlogMenu({ isOpen: false });

    expect(
      screen.queryByRole("navigation", { name: "Blog navigation" }),
    ).not.toBeInTheDocument();
  });

  test("keeps Shift+Tab focus inside the menu", () => {
    renderBlogMenu();

    const firstLink = screen.getByRole("link", { name: "Home" });
    const closeButton = screen.getByRole("button", { name: "Close menu" });

    firstLink.focus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });

    expect(closeButton).toHaveFocus();
  });

  test("closes by Escape and overlay click", () => {
    const onClose = jest.fn();
    renderBlogMenu({ onClose });

    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.mouseDown(screen.getByRole("navigation", {
      name: "Blog navigation",
    }));

    expect(onClose).toHaveBeenCalledTimes(2);
  });

  test("does not close on child mousedown", () => {
    const onClose = jest.fn();
    renderBlogMenu({ onClose });

    fireEvent.mouseDown(screen.getByRole("link", { name: "Home" }));

    expect(onClose).not.toHaveBeenCalled();
  });

  test("close button closes menu", () => {
    const onClose = jest.fn();
    renderBlogMenu({ onClose });

    fireEvent.click(screen.getByRole("button", { name: "Close menu" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("keeps existing logout handler", () => {
    const onClose = jest.fn();
    const onLogout = jest.fn();

    renderBlogMenu({
      loggedIn: true,
      currentUser: { email: "test@test.com" },
      onClose,
      onLogout,
    });

    fireEvent.click(screen.getByRole("button", { name: "LOG OUT" }));

    expect(onLogout).toHaveBeenCalledWith("test@test.com");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("locks page scroll while open", () => {
    renderBlogMenu();

    expect(document.body).toHaveStyle({ overflow: "hidden" });
    expect(document.documentElement).toHaveStyle({ overflow: "hidden" });
  });

  test("returns focus to the current trigger after Escape", () => {
    renderWithProviders(<BlogMenuController />);

    const firstTrigger = screen.getByRole("button", {
      name: "Open blog menu A",
    });
    const secondTrigger = screen.getByRole("button", {
      name: "Open blog menu B",
    });

    firstTrigger.focus();
    fireEvent.click(firstTrigger);
    fireEvent.keyDown(window, { key: "Escape" });

    expect(firstTrigger).toHaveFocus();
    expect(
      screen.queryByRole("navigation", { name: "Blog navigation" }),
    ).not.toBeInTheDocument();

    secondTrigger.focus();
    fireEvent.click(secondTrigger);
    fireEvent.keyDown(window, { key: "Escape" });

    expect(secondTrigger).toHaveFocus();
  });

  test("keeps NavLink activation on the link itself", () => {
    const onHomeClick = jest.fn();
    renderBlogMenu({ onHomeClick });

    const homeLink = screen.getByRole("link", { name: "Home" });

    fireEvent.click(homeLink);

    expect(onHomeClick).toHaveBeenCalledTimes(1);
  });
});
