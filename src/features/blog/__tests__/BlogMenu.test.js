import { useState } from "react";
import { fireEvent, screen } from "@testing-library/react";
import MainMenu from "../../../app/components/MainMenu";
import { renderWithProviders } from "../../../test/renderWithProviders";

function renderBlogMenu(props = {}, route = "/journal") {
  const defaultProps = {
    isOpen: true,
    loggedIn: false,
    onLogout: jest.fn(),
    onClose: jest.fn(),
    theme: "blog",
    navigationLabel: "Blog navigation",
  };

  return renderWithProviders(<MainMenu {...defaultProps} {...props} />, {
    route,
  });
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
      <MainMenu
        isOpen={isOpen}
        loggedIn={false}
        onLogout={jest.fn()}
        onClose={() => setIsOpen(false)}
        theme="blog"
        navigationLabel="Blog navigation"
      />
    </>
  );
}

describe("blog MainMenu", () => {
  afterEach(() => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  });

  test("moves focus inside when opened", () => {
    renderBlogMenu();

    expect(
      screen.getByRole("button", { name: "Close main menu" }),
    ).toHaveFocus();
  });

  test("does not render when closed", () => {
    renderBlogMenu({ isOpen: false });

    expect(
      screen.queryByRole("navigation", { name: "Blog navigation" }),
    ).not.toBeInTheDocument();
  });

  test("closes by Escape and overlay click", () => {
    const onClose = jest.fn();
    renderBlogMenu({ onClose });

    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.mouseDown(
      screen.getByRole("navigation", { name: "Blog navigation" }),
    );

    expect(onClose).toHaveBeenCalledTimes(2);
  });

  test("does not close on child mousedown", () => {
    const onClose = jest.fn();
    renderBlogMenu({ onClose });

    fireEvent.mouseDown(screen.getByRole("link", { name: "Journal" }));

    expect(onClose).not.toHaveBeenCalled();
  });

  test("close button closes menu", () => {
    const onClose = jest.fn();
    renderBlogMenu({ onClose });

    fireEvent.click(screen.getByRole("button", { name: "Close main menu" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("keeps the logout handler", () => {
    const onLogout = jest.fn();
    renderBlogMenu({ loggedIn: true, onLogout });

    fireEvent.click(screen.getByRole("button", { name: "Log out" }));

    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  test("locks page scroll while open", () => {
    renderBlogMenu();

    expect(document.body).toHaveStyle({ overflow: "hidden" });
    expect(document.documentElement).toHaveStyle({ overflow: "hidden" });
  });

  test("returns focus to the current trigger after Escape", () => {
    renderWithProviders(<BlogMenuController />, { route: "/journal" });

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

    secondTrigger.focus();
    fireEvent.click(secondTrigger);
    fireEvent.keyDown(window, { key: "Escape" });

    expect(secondTrigger).toHaveFocus();
  });

  test("marks the current blog subsection as active", () => {
    renderBlogMenu({}, "/journal/posts");

    expect(screen.getByRole("link", { name: "Posts" })).toHaveClass(
      "main-menu__subsection-link_active",
    );
  });
});
